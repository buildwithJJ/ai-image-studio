import urllib.parse
import uuid

def generate_cinematic_portrait(prompt: str) -> str:
    """
    Uses Pollinations.ai to generate an image via a simple GET request.
    Appends a random seed to ensure uniqueness even with the same prompt.
    """
    seed = uuid.uuid4().hex[:8]
    base_url = "https://image.pollinations.ai/prompt/"
    
    # Add cinematic styles to the prompt to enforce premium aesthetic
    enhanced_prompt = f"4k cinematic portrait, {prompt}, highly detailed, professional photography, dramatic lighting"
    
    encoded_prompt = urllib.parse.quote(enhanced_prompt)
    url = f"{base_url}{encoded_prompt}?seed={seed}&width=1024&height=1024&nologo=true"
    
    return url
