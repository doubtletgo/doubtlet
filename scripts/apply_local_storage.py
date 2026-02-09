
import os
import re

TARGET_DIR = r"d:\imd\Doubtlet\components\calculators"

def process_file(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    filename = os.path.basename(file_path)
    component_name = os.path.splitext(filename)[0]

    # Only modify if useState is used
    if "useState" not in content:
        return
        
    # Check if useLocalStorage is already imported to avoid duplication
    if "useLocalStorage" in content:
        print(f"Skipping {filename}: useLocalStorage already present")
        return

    print(f"Processing {filename}...")

    # 1. Add import
    # Add it after the last import line or at top
    # We try to place it after 'react' import or at the top of imports
    if "import" in content:
         # Find the line with 'from 'react''
         # We add a newline with our import
         pattern = re.compile(r"(import .*?from ['\"]react['\"];?)", re.MULTILINE)
         if pattern.search(content):
             content = pattern.sub(r"\1\nimport useLocalStorage from '@/hooks/useLocalStorage';", content, count=1)
         else:
             # Just prepend to first import
             content = re.sub(r"^(import )", r"import useLocalStorage from '@/hooks/useLocalStorage';\n\1", content, count=1, flags=re.MULTILINE)
    else:
         content = "import useLocalStorage from '@/hooks/useLocalStorage';\n" + content

    # 2. Replace useState calls
    # Supports: const [var, setVar] = useState(init);
    
    def replacer(match):
        var_name = match.group(1)
        setter_name = match.group(2)
        initial_value = match.group(3).strip()
        
        if not initial_value:
            initial_value = "undefined" # Explicitly handle empty init
        
        # Generate a unique key for local storage
        key = f"{component_name}_{var_name}"
        
        return f"const [{var_name}, {setter_name}] = useLocalStorage('{key}', {initial_value});"

    # Regex: 
    # const [var, setVar] = useState( ... );
    # capture inner content of useState(...) non-greedy until );
    regex = r"const\s+\[(\w+),\s*(\w+)\]\s*=\s*(?:React\.)?useState\(\s*([\s\S]*?)\s*\);"
    
    new_content = re.sub(regex, replacer, content)

    if new_content != content:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"  -> Converted {filename}")
    else:
        print(f"  -> No matching useState calls in {filename}")

def main():
    for root, dirs, files in os.walk(TARGET_DIR):
        for file in files:
            if file.endswith((".jsx", ".tsx", ".js", ".ts")) and "d.ts" not in file:
                file_path = os.path.join(root, file)
                try:
                    process_file(file_path)
                except Exception as e:
                    print(f"Failed to process {file}: {e}")

if __name__ == "__main__":
    main()
