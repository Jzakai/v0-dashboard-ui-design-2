def validate_scenario_schema(scenario):
    required_fields = [
        "environment",
        "skill_category",
        "skill",
        "difficulty",
        "casualties",
        "injects",
        "objectives",
        "expected_actions",
        "evaluation_metrics",
    ]

    for field in required_fields:
        if field not in scenario:
            raise ValueError(f"Invalid scenario format: missing {field}")

    return True
