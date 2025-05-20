import os
import re
import spacy
import PyPDF2
from docx import Document
import json
from flask import Blueprint, request, jsonify

# Initialize the spaCy NLP model
try:
    nlp = spacy.load("en_core_web_lg")
except:
    # If model is not available, download it
    import subprocess
    subprocess.call(['python', '-m', 'spacy', 'download', 'en_core_web_lg'])
    nlp = spacy.load("en_core_web_lg")

# Create Blueprint
resume_bp = Blueprint('resume', __name__)

def extract_text_from_pdf(file_path):
    """Extract text from PDF file"""
    text = ""
    with open(file_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        num_pages = len(reader.pages)
        
        for page_num in range(num_pages):
            page = reader.pages[page_num]
            text += page.extract_text()
    
    return text

def extract_text_from_docx(file_path):
    """Extract text from DOCX file"""
    doc = Document(file_path)
    text = ""
    
    for paragraph in doc.paragraphs:
        text += paragraph.text + "\n"
    
    return text

def extract_text_from_file(file_path):
    """Extract text based on file type"""
    _, file_extension = os.path.splitext(file_path)
    
    if file_extension.lower() == '.pdf':
        return extract_text_from_pdf(file_path)
    elif file_extension.lower() == '.docx':
        return extract_text_from_docx(file_path)
    elif file_extension.lower() == '.txt':
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as file:
            return file.read()
    else:
        raise ValueError(f"Unsupported file format: {file_extension}")

def extract_education(text):
    """Extract education details from text"""
    education = []
    
    # Define education-related keywords
    education_keywords = [
        r'education', r'academic background', r'degree', r'university', 
        r'college', r'school', r'b\.tech', r'b\.e', r'm\.tech', r'm\.e',
        r'bachelor', r'master', r'phd', r'doctorate', r'post-graduate',
        r'undergraduate', r'graduate'
    ]
    
    # Create a pattern to find education section
    education_pattern = r'(?i)(EDUCATION|ACADEMIC BACKGROUND|QUALIFICATIONS).*?\n(.*?)(?:\n\n|\Z)'
    
    # Process the text with spaCy
    doc = nlp(text)
    
    # Try to find education section
    education_sections = re.findall(education_pattern, text, re.DOTALL)
    
    if education_sections:
        for section_title, section_content in education_sections:
            # Split by newlines to get individual entries
            entries = [e.strip() for e in section_content.split('\n') if e.strip()]
            for entry in entries:
                education.append(entry)
    else:
        # If no clear education section, look for sentences with education keywords
        sentences = [sent.text for sent in doc.sents]
        for sentence in sentences:
            for keyword in education_keywords:
                if re.search(r'\b' + keyword + r'\b', sentence, re.IGNORECASE):
                    education.append(sentence.strip())
                    break
    
    # Remove duplicates
    education = list(set(education))
    
    return education

def extract_skills(text):
    """Extract skills from text"""
    skills = []
    
    # Define common skills and technologies
    tech_skills = [
        'python', 'java', 'javascript', 'c\+\+', 'c#', 'ruby', 'php', 'html', 'css',
        'react', 'angular', 'vue', 'node\.js', 'express', 'django', 'flask', 'spring',
        'sql', 'nosql', 'mongodb', 'postgresql', 'mysql', 'oracle', 'firebase',
        'aws', 'azure', 'gcp', 'cloud', 'docker', 'kubernetes', 'jenkins', 'git',
        'ci/cd', 'agile', 'scrum', 'machine learning', 'data science', 'ai', 'nlp',
        'computer vision', 'deep learning', 'tensorflow', 'pytorch', 'keras', 
        'tableau', 'power bi', 'data visualization', 'excel', 'statistics',
        'blockchain', 'ethereum', 'solidity', 'smart contracts'
    ]
    
    # Try to find skills section
    skills_pattern = r'(?i)(SKILLS|TECHNICAL SKILLS|TECHNOLOGIES|COMPETENCIES).*?\n(.*?)(?:\n\n|\Z)'
    skills_sections = re.findall(skills_pattern, text, re.DOTALL)
    
    if skills_sections:
        for section_title, section_content in skills_sections:
            # Look for skill items - often separated by commas, bullets, or newlines
            items = re.split(r'[,•\n]', section_content)
            for item in items:
                if item.strip():
                    skills.append(item.strip())
    else:
        # If no clear skills section, look for known tech skills
        for skill in tech_skills:
            if re.search(r'\b' + skill + r'\b', text, re.IGNORECASE):
                match = re.search(r'\b' + skill + r'\b', text, re.IGNORECASE)
                skills.append(match.group(0))
    
    # Remove duplicates
    skills = list(set(skills))
    
    return skills

def extract_experience(text):
    """Extract work experience from text"""
    experience = []
    
    # Try to find experience section
    exp_pattern = r'(?i)(EXPERIENCE|WORK EXPERIENCE|EMPLOYMENT|PROFESSIONAL EXPERIENCE).*?\n(.*?)(?:\n\n|\Z)'
    exp_sections = re.findall(exp_pattern, text, re.DOTALL)
    
    if exp_sections:
        for section_title, section_content in exp_sections:
            # Try to identify individual positions - often start with a company name or role
            # This is a simple approach; more sophisticated parsing would be needed for better results
            positions = re.split(r'\n(?=[A-Z])', section_content)
            for position in positions:
                if len(position.strip()) > 10:  # Arbitrary length to filter out noise
                    experience.append(position.strip())
    else:
        # If no clear experience section, look for date patterns often found in experience
        date_pattern = r'\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|June|July|August|September|October|November|December)\s+\d{4}\s*[-–—]\s*((Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|June|July|August|September|October|November|December)\s+\d{4}|Present|Current)'
        date_matches = re.finditer(date_pattern, text, re.IGNORECASE)
        
        for match in date_matches:
            # Get the line containing the date
            start_pos = text.rfind('\n', 0, match.start()) + 1
            end_pos = text.find('\n', match.end())
            if end_pos == -1:
                end_pos = len(text)
            
            exp_line = text[start_pos:end_pos].strip()
            
            # Get a few lines after to capture role description
            next_lines_end = text.find('\n\n', end_pos)
            if next_lines_end == -1:
                next_lines_end = len(text)
            
            description = text[end_pos:next_lines_end].strip()
            
            if exp_line:
                full_exp = exp_line + "\n" + description if description else exp_line
                experience.append(full_exp)
    
    return experience

def extract_certificates(text):
    """Extract certifications from text"""
    certifications = []
    
    # Try to find certifications section
    cert_pattern = r'(?i)(CERTIFICATIONS|CERTIFICATES|PROFESSIONAL DEVELOPMENT).*?\n(.*?)(?:\n\n|\Z)'
    cert_sections = re.findall(cert_pattern, text, re.DOTALL)
    
    if cert_sections:
        for section_title, section_content in cert_sections:
            # Split by newlines to get individual certificates
            certs = [c.strip() for c in section_content.split('\n') if c.strip()]
            certifications.extend(certs)
    else:
        # Look for common certification keywords
        cert_keywords = [
            r'certified', r'certificate', r'certification', r'licensed', 
            r'accredited', r'diploma'
        ]
        
        doc = nlp(text)
        sentences = [sent.text for sent in doc.sents]
        
        for sentence in sentences:
            for keyword in cert_keywords:
                if re.search(r'\b' + keyword + r'\b', sentence, re.IGNORECASE):
                    certifications.append(sentence.strip())
                    break
    
    return certifications

def extract_achievements(text):
    """Extract achievements from text"""
    achievements = []
    
    # Try to find achievements section
    achieve_pattern = r'(?i)(ACHIEVEMENTS|ACCOMPLISHMENTS|AWARDS|HONORS).*?\n(.*?)(?:\n\n|\Z)'
    achieve_sections = re.findall(achieve_pattern, text, re.DOTALL)
    
    if achieve_sections:
        for section_title, section_content in achieve_sections:
            # Split by newlines to get individual achievements
            items = [a.strip() for a in section_content.split('\n') if a.strip()]
            achievements.extend(items)
    else:
        # Look for achievement-related keywords in sentences
        achievement_keywords = [
            r'award', r'honor', r'achieve', r'accomplishment', r'recognition',
            r'scholarship', r'fellowship', r'grant', r'prize', r'medal', r'winner',
            r'recipient', r'honored', r'recognized', r'selected'
        ]
        
        doc = nlp(text)
        sentences = [sent.text for sent in doc.sents]
        
        for sentence in sentences:
            for keyword in achievement_keywords:
                if re.search(r'\b' + keyword + r'\b', sentence, re.IGNORECASE):
                    achievements.append(sentence.strip())
                    break
    
    return achievements

def extract_qualifications(text):
    """Extract qualifications from text"""
    qualifications = []
    
    # Try to find qualifications section
    qual_pattern = r'(?i)(QUALIFICATIONS|PROFESSIONAL QUALIFICATIONS).*?\n(.*?)(?:\n\n|\Z)'
    qual_sections = re.findall(qual_pattern, text, re.DOTALL)
    
    if qual_sections:
        for section_title, section_content in qual_sections:
            # Split by newlines to get individual qualifications
            items = [q.strip() for q in section_content.split('\n') if q.strip()]
            qualifications.extend(items)
    else:
        # This could overlap with education or certifications
        # We'll look for specific qualification keywords
        qual_keywords = [
            r'qualified', r'proficient', r'license', r'permitted', 
            r'authorized', r'accredited', r'certified'
        ]
        
        doc = nlp(text)
        sentences = [sent.text for sent in doc.sents]
        
        for sentence in sentences:
            for keyword in qual_keywords:
                if re.search(r'\b' + keyword + r'\b', sentence, re.IGNORECASE):
                    if sentence.strip() not in qualifications:
                        qualifications.append(sentence.strip())
                    break
    
    # Remove duplicates that might be in education already
    # (This is a simple approach; more sophisticated de-duplication might be needed)
    
    return qualifications

def parse_resume(file_path):
    """Main function to parse resume"""
    
    # Extract text from file
    text = extract_text_from_file(file_path)
    
    # Extract various components
    education = extract_education(text)
    skills = extract_skills(text)
    experience = extract_experience(text)
    certifications = extract_certificates(text)
    achievements = extract_achievements(text)
    qualifications = extract_qualifications(text)
    
    # Combine into result
    result = {
        "education": education,
        "skills": skills,
        "experience": experience,
        "certifications": certifications,
        "achievements": achievements,
        "qualifications": qualifications
    }
    
    return result

@resume_bp.route('/parse', methods=['POST'])
def parse_resume_api():
    """API endpoint to parse resume"""
    
    # Check if file is in request
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400
    
    file = request.files['file']
    
    # Check if file has a name
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400
    
    # Check file extension
    allowed_extensions = {'.pdf', '.docx', '.txt'}
    file_ext = os.path.splitext(file.filename)[1].lower()
    
    if file_ext not in allowed_extensions:
        return jsonify({"error": f"File type not supported. Allowed types: {', '.join(allowed_extensions)}"}), 400
    
    # Create a temporary path to save the file
    temp_path = os.path.join('/tmp', file.filename)
    file.save(temp_path)
    
    try:
        # Parse the resume
        result = parse_resume(temp_path)
        
        # Delete the temporary file
        os.remove(temp_path)
        
        return jsonify(result), 200
    
    except Exception as e:
        # Clean up in case of error
        if os.path.exists(temp_path):
            os.remove(temp_path)
        
        return jsonify({"error": str(e)}), 500
