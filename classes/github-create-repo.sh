
# Git installation and Repo connection workflow
# Contains commands used in a video illustration called "How to create a GitHub repo"

# Install git (version control engine)
winget install Git.Git

#Configure name and email 
git config --global user.name "AB Heart Code"
git config --global user.email "ab@email.com"

# Install github cli
winget install GitHub.cli 

# After creating repo on Github

# Initialise local git (set's local branch to main)
git init -b  main

# Link github repo to local repo 
git remote add origin https://github.com/ab-grok/test-repo.git
# Merge local and GitHub folders 
git pull origin main --allow-unrelated-histories 


# Push your first commit
git add .; git commit -m "First Commit"; git push -u origin main;

# Push on further commit
git add .; git commit -m "First Commit"; git push