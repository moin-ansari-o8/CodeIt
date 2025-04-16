import os
from tkinter import Tk
from tkinter.filedialog import askdirectory

# Define extensions you care about
valid_extensions = {
    ".js",
    ".jsx",
    ".ts",
    ".tsx",
    ".html",
    ".css",
    ".py",
    ".json",
    ".md",
}

# Folders to ignore
ignore_dirs = {"node_modules", ".git", "__pycache__", ".next", ".vscode"}

output_lines = []


def print_structure(root_path, prefix=""):
    entries = sorted(os.listdir(root_path))
    for i, entry in enumerate(entries):
        full_path = os.path.join(root_path, entry)
        is_last = i == len(entries) - 1
        pointer = "└── " if is_last else "├── "
        line = prefix + pointer + entry
        output_lines.append(line)

        if os.path.isdir(full_path) and entry not in ignore_dirs:
            new_prefix = prefix + ("    " if is_last else "│   ")
            print_structure(full_path, new_prefix)


def extract_code_snippets(root_path, collected_files):
    for root, dirs, files in os.walk(root_path):
        dirs[:] = [d for d in dirs if d not in ignore_dirs]
        for file in files:
            ext = os.path.splitext(file)[1]
            if ext in valid_extensions:
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, root_path)
                try:
                    with open(full_path, "r", encoding="utf-8") as f:
                        content = f.read()
                        if content.strip():  # Only add if file has content
                            collected_files.append((rel_path, content))
                except Exception as e:
                    print(f"Couldn't read {rel_path}: {e}")


def generate_output_txt(root_path, output_filename="project_structure_output.txt"):
    output_lines.clear()
    collected_files = []

    root_name = os.path.basename(os.path.abspath(root_path))
    output_lines.append(f'File Structure of "{root_name}":')
    print_structure(root_path)
    output_lines.append("\nFile Details of the Root directory:")

    extract_code_snippets(root_path, collected_files)

    for idx, (filepath, content) in enumerate(collected_files, 1):
        output_lines.append(f"\n{idx}. {filepath} ::\n{content}")

    with open(output_filename, "w", encoding="utf-8") as f:
        f.write("\n".join(output_lines))
    print(f"\n✅ Output saved to: {output_filename}")


# 👇 Run this by selecting the folder path
if __name__ == "__main__":
    import sys

    if len(sys.argv) < 2:
        print("📂 Launching folder selection dialog...")
        Tk().withdraw()  # Hide the main Tkinter window
        folder_path = askdirectory(title="Select Project Folder")
        if folder_path:
            generate_output_txt(folder_path)
        else:
            print("❌ No folder selected. Exiting...")
    else:
        generate_output_txt(sys.argv[1])