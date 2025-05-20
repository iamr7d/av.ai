from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from dotenv import load_dotenv
import jwt
from datetime import datetime, timedelta
from functools import wraps
import uuid

# Import the resume parser blueprint
from resume_parser import resume_bp

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Configure JWT
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-secret-key-here')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)

# Register the resume parser blueprint
app.register_blueprint(resume_bp, url_prefix='/api/resume')

# Sample data for PhD opportunities
sample_phd_opportunities = [
    {
        "id": 1,
        "title": "Machine Learning for Climate Change Prediction",
        "university": "Stanford University",
        "department": "Computer Science",
        "description": "Research on using advanced machine learning techniques for climate change prediction and analysis.",
        "requirements": "MS in Computer Science or related field, experience with machine learning and environmental data analysis.",
        "deadline": "2025-12-15",
        "funding": "Fully funded",
        "contact": "prof.smith@stanford.edu"
    },
    {
        "id": 2,
        "title": "Quantum Computing Algorithms",
        "university": "MIT",
        "department": "Physics",
        "description": "Developing novel quantum algorithms for optimization problems in various scientific domains.",
        "requirements": "MS in Physics, Computer Science, or Mathematics, strong background in quantum mechanics.",
        "deadline": "2025-11-30",
        "funding": "Fully funded with stipend",
        "contact": "quantum.research@mit.edu"
    },
    {
        "id": 3,
        "title": "AI-Driven Drug Discovery",
        "university": "Harvard University",
        "department": "Biomedical Engineering",
        "description": "Using artificial intelligence to accelerate drug discovery and development processes.",
        "requirements": "MS in Biomedical Engineering, Computer Science, or related field, experience with AI and molecular biology.",
        "deadline": "2026-01-10",
        "funding": "Partial funding available",
        "contact": "bio.research@harvard.edu"
    },
    {
        "id": 4,
        "title": "Natural Language Processing for Healthcare",
        "university": "University of California, Berkeley",
        "department": "Computer Science",
        "description": "Developing NLP models to improve healthcare delivery and patient outcomes through automated medical text analysis.",
        "requirements": "MS in Computer Science or related field, experience with NLP and healthcare data.",
        "deadline": "2025-10-31",
        "funding": "Fully funded",
        "contact": "nlp.healthcare@berkeley.edu"
    },
    {
        "id": 5,
        "title": "Renewable Energy Systems Optimization",
        "university": "ETH Zurich",
        "department": "Electrical Engineering",
        "description": "Optimization of renewable energy systems for improved efficiency and grid integration.",
        "requirements": "MS in Electrical Engineering, Energy Systems, or related field, experience with energy system modeling.",
        "deadline": "2025-11-15",
        "funding": "Fully funded with stipend",
        "contact": "energy.phd@ethz.ch"
    }
]

@app.route('/api/opportunities', methods=['GET'])
def get_opportunities():
    """Return all PhD opportunities or filtered by search query"""
    query = request.args.get('query', '').lower()
    
    if query:
        filtered_opportunities = [
            opp for opp in sample_phd_opportunities 
            if query in opp['title'].lower() or 
               query in opp['university'].lower() or 
               query in opp['department'].lower() or 
               query in opp['description'].lower()
        ]
        return jsonify(filtered_opportunities)
    
    return jsonify(sample_phd_opportunities)

@app.route('/api/opportunity/<int:opportunity_id>', methods=['GET'])
def get_opportunity(opportunity_id):
    """Return a specific PhD opportunity by ID"""
    opportunity = next((opp for opp in sample_phd_opportunities if opp['id'] == opportunity_id), None)
    
    if opportunity:
        return jsonify(opportunity)
    
    return jsonify({"error": "Opportunity not found"}), 404

@app.route('/api/search', methods=['POST'])
def search_opportunities():
    """Advanced search for PhD opportunities with multiple criteria"""
    data = request.json
    
    # Get search parameters
    keywords = data.get('keywords', '').lower()
    university = data.get('university', '').lower()
    department = data.get('department', '').lower()
    funding = data.get('funding', '').lower()
    
    # Filter opportunities
    results = sample_phd_opportunities
    
    if keywords:
        results = [
            opp for opp in results 
            if keywords in opp['title'].lower() or 
               keywords in opp['description'].lower()
        ]
    
    if university:
        results = [opp for opp in results if university in opp['university'].lower()]
    
    if department:
        results = [opp for opp in results if department in opp['department'].lower()]
    
    if funding:
        results = [opp for opp in results if funding in opp['funding'].lower()]
    
    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
