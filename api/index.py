import os
import sys

# Vercel Serverless Function entrypoint
# Append backend to path so imports work
sys.path.append(os.path.join(os.path.dirname(os.path.dirname(__file__)), "backend"))

from app.main import app
