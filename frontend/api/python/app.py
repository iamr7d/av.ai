from http.server import BaseHTTPRequestHandler
import os
import json
from datetime import datetime, timedelta
import uuid
import sys
import importlib.util

# Add the api directory to the Python path
api_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if api_dir not in sys.path:
    sys.path.append(api_dir)

# Sample data for PhD opportunities
sample_phd_opportunities = [
    {
        "id": 1,
        "title": "Machine Learning for Climate Change Prediction",
        "university": "Stanford University",
        "department": "Computer Science",
        "location": "Stanford, CA",
        "description": "This PhD position focuses on developing novel machine learning algorithms to improve climate change prediction models...",
        "requirements": ["MSc in Computer Science", "Strong background in ML", "Python programming"],
        "deadline": "2023-12-31",
        "stipend": "$40,000 per year",
        "email": "advisor@stanford.edu",
        "posted_date": "2023-06-15",
        "advisor": "Dr. Jane Smith",
        "tags": ["Machine Learning", "Climate Science", "AI"]
    },
    {
        "id": 2,
        "title": "Quantum Computing for Drug Discovery",
        "university": "MIT",
        "department": "Physics",
        "location": "Cambridge, MA",
        "description": "Research the application of quantum computing algorithms to accelerate drug discovery processes...",
        "requirements": ["MSc in Physics or Computer Science", "Background in quantum mechanics", "Programming experience"],
        "deadline": "2023-11-30",
        "stipend": "$45,000 per year",
        "email": "qc_lab@mit.edu",
        "posted_date": "2023-05-20",
        "advisor": "Dr. Robert Chen",
        "tags": ["Quantum Computing", "Drug Discovery", "Computational Chemistry"]
    }
]

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        
        if self.path == '/api/opportunities':
            response_data = {
                "message": "Success",
                "data": sample_phd_opportunities
            }
        elif self.path.startswith('/api/opportunity/'):
            try:
                opp_id = int(self.path.split('/')[-1])
                opportunity = next((opp for opp in sample_phd_opportunities if opp["id"] == opp_id), None)
                if opportunity:
                    response_data = {
                        "message": "Success",
                        "data": opportunity
                    }
                else:
                    response_data = {
                        "message": "Opportunity not found",
                        "data": None
                    }
            except:
                response_data = {
                    "message": "Invalid opportunity ID",
                    "data": None
                }
        else:
            response_data = {
                "message": "Welcome to the PhD Opportunity Finder API",
                "endpoints": [
                    "/api/opportunities",
                    "/api/opportunity/{id}"
                ]
            }
        
        self.wfile.write(json.dumps(response_data).encode())
        return

    def do_POST(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        
        if self.path == '/api/search':
            try:
                data = json.loads(post_data.decode())
                query = data.get('query', '').lower()
                filtered_opps = sample_phd_opportunities
                
                if query:
                    filtered_opps = [
                        opp for opp in filtered_opps
                        if query in opp['title'].lower() or 
                           query in opp['description'].lower() or
                           query in opp['university'].lower()
                    ]
                
                response_data = {
                    "message": "Success",
                    "data": filtered_opps
                }
            except:
                response_data = {
                    "message": "Error processing search request",
                    "data": []
                }
        else:
            response_data = {
                "message": "Endpoint not found",
                "data": None
            }
        
        self.wfile.write(json.dumps(response_data).encode())
        return
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        return
