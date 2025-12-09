# Tactex: AI-driven Tactical Medical Training System Using VR

## Overview
Tactex an AI-powered Virtual Reality (VR) training platform designed for  combat medics. The system leverages VR to immerse trainees in highly realistic medical emergency scenarios, while AI dynamically generates and adapts these scenarios based on trainee performance. Unlike conventional training, which relies on mannequins or static simulations, this system provides interactive, customizable, and scalable experiences that can better prepare medical personnel for unpredictable real-world conditions. By integrating VR and AI, the platform seeks to bridge the gap between classroom knowledge and field application, ultimately enhancing decision-making, accuracy, and response times in high-pressure environments.

## installation steps

1. clone repository
```bash
git clone https://github.com/https://github.com/Jzakai/v0-dashboard-ui-design-2.git
```
2. open VS code and go to Integration branch
3. open VS code terminal and paste this command to install the requirments
```bash
pip install -r requirements.txt
```
5. create .env file
```bash
   touch .env
```
6. add the api keys to the .env file (sent privately)

7. navigate to backend folder from the terminal to run the fastAPI
```bash
cd backend
uvicorn main:app --reload --reload-dir . --port 8000
```
8. keep the previous terminal and open a new terminal in the VS code to run the frontend via the following command
```bash
pnpm dev
```
