from textwrap import dedent
import os
from dotenv import load_dotenv
import json
import re

from langchain_community.chat_models import ChatOpenAI
from langchain_community.document_loaders import PyPDFLoader
from langchain_community.vectorstores import LanceDB
from langchain_community.embeddings import HuggingFaceEmbeddings

from langchain.prompts import ChatPromptTemplate
from langchain.schema.runnable import RunnableMap



load_dotenv()
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")


# 1) Embeddings (FREE, LOCAL)
def get_embeddings():
    return HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-mpnet-base-v2"
    )


# 2) Knowledge Base Loader with Caching
def load_knowledge_base():
    import lancedb

    pdf_path = "protocols/TCCC_guidelines.pdf"
    db_uri = "tmp/lancedb"
    table_name = "tccc_knowledge"

    db = lancedb.connect(db_uri)
    embeddings = get_embeddings()

    if table_name in db.table_names():
        print(" Using cached LanceDB")
        vectordb = LanceDB(
            embedding=embeddings,
            uri=db_uri,
            table_name=table_name,
        )
        return vectordb.as_retriever(search_kwargs={"k": 5})

    print("No cache found. Building vector DB...")
    loader = PyPDFLoader(pdf_path)
    docs = loader.load()

    vectordb = LanceDB.from_documents(
        documents=docs,
        embedding=embeddings,
        uri=db_uri,
        table_name=table_name,
    )

    return vectordb.as_retriever(search_kwargs={"k": 5})



# 3) OpenRouter LLM
def get_openrouter_llm():
    return ChatOpenAI(
        model="meta-llama/llama-3.1-8b-instruct",
        openai_api_key=OPENROUTER_API_KEY,
        openai_api_base="https://openrouter.ai/api/v1",
        default_headers={
            "HTTP-Referer": "http://localhost",
            "X-Title": "TACTEX-VR-Scenario-Agent"
        },
        temperature=0.2,
    )

# 4) LCEL RAG Scenario Generator
def generate_scenario_from_agent(skill_category: str, skill: str, difficulty: str):

    instructions = dedent(f"""
       You are the Scenario Generation Agent for the TACTEX VR system.
        Your job is to generate medically accurate, TCCC-compliant VR training scenarios.

        INPUT PARAMETERS:
        - Skill Category: {skill_category}
        - Skill: {skill}
        - Difficulty Level: {difficulty}

        You MUST:
        1. Retrieve relevant doctrine from the knowledge base (TCCC, MARCH, evacuation protocols)
        2. Use retrieval-augmented generation (RAG) to ensure accuracy
        3. Generate TWO main outputs:
            A. A short mission narrative (~150 words)
            B. A detailed ScenarioSpec JSON with the following structure:

            {{
                "environment": "...",
                "skill_category": "...",
                "skill": "...",
                "difficulty": "...",
                "casualties": [...],
                "injects": [...],
                "objectives": [...],
                "expected_actions": [...],
                "evaluation_metrics": [...]
            }}

        RULES:
        - Follow TCCC standards precisely.
        - Do NOT hallucinate medical steps not in doctrine.
        - Every medical action must be justified using retrieved doctrine.
        - JSON must be valid, strict, and conform to schema.

        Your tone must be factual, concise, and militarily accurate.
    """)

    retriever = load_knowledge_base()
    llm = get_openrouter_llm()

    # LCEL Prompt
    prompt = ChatPromptTemplate.from_template("""
    Use the following knowledge base context to answer medically accurately:

    CONTEXT:
    {context}

    USER REQUEST:
    {question}
    """)

    # LCEL chain
    rag_chain = (
        RunnableMap({
            "context": retriever,      # Automatic retrieval
            "question": lambda x: x    # Pass instructions forward
        })
        | prompt
        | llm
    )

    # Run LCEL
    result = rag_chain.invoke(instructions)
    print(result)

    llm_output = result.content


    scenario_spec = extract_json_from_llm_output(llm_output)
    rationale_text = extract_rationale(llm_output)

    print(scenario_spec)

    
    return {
        "scenario_spec": scenario_spec,
        "rationale": rationale_text
    }


    

# Scenario Modification
def modify_scenario_with_agent(existing_json: str, edits: str):

    llm = get_openrouter_llm()

    instructions = f"""
    Modify this scenario JSON ONLY according to requested edits.

    EXISTING:
    {existing_json}

    EDITS:
    {edits}
    """

    return llm.invoke(instructions).content




def normalize_scenario_spec(spec: dict):
    # Ensure objectives always have type + description
    spec["objectives"] = [
        {
            "type": o.get("type", "Medical"),
            "description": o.get("description", "")
        }
        for o in spec.get("objectives", [])
    ]

    # Ensure injects always have type + location
    spec["injects"] = [
        {
            "type": inj.get("type", "Event"),
            "location": inj.get("location", "General Area"),
        }
        for inj in spec.get("injects", [])
    ]

    # Ensure environment shape is correct
    spec["environment"] = {
        "location": spec.get("environment", {}).get("location", "Unknown"),
        "terrain": spec.get("environment", {}).get("terrain", "Unknown"),
        "weather": spec.get("environment", {}).get("weather", "Unknown"),
    }

    return spec

def extract_json_from_llm_output(text: str) -> dict:
    """
    Extracts the FIRST JSON block inside ```json ... ``` from an LLM output.
    Returns a dictionary.
    Raises a clear error if no JSON is found.
    """

    # Look for ```json ... ```
    json_match = re.search(r"```json(.*?)```", text, re.DOTALL)

    if not json_match:
        raise ValueError("No JSON block found in LLM output")

    json_str = json_match.group(1).strip()

    try:
        return json.loads(json_str)
    except json.JSONDecodeError as e:
        raise ValueError(f"JSON parsing failed: {e}\nExtracted JSON:\n{json_str}")
    

def extract_rationale(text: str) -> str:
    """
    Extracts the rationale section from the LLM output if present.
    Returns an empty string if not found.
    """

    match = re.search(r"\*\*Narrative:\*\*(.*)", text, re.DOTALL)
    if match:
        return match.group(1).strip()

    # Fallback: everything AFTER the JSON block
    parts = text.split("```")  # split at codefences
    if len(parts) > 2:
        return parts[-1].strip()

    return ""