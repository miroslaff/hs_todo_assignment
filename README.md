# ToDo Application
A simple ToDo application offering the creation and management of todo tasks in a straightforward list, with beautiful and minimalistic styling.

## Testing Strategy
After initial inspection of the application, it seems that it doesn't rely on API for any of the actions, so the testing would be mostly on the UI side, with a small number of backend-ish tests.
### Functional Testing
- Creating, editing and deleting tasks by using the page input/button elements
- Testing task content i.e. special characters, cyrilic support etc.
- Task completion and filtering
### Non-functional Testing
As noted above, since there is no API involved, performance testing is not necessary as the application behaves as good as the user's hardware capabilities. However, since we rely on inputs for our task creation, simple security checks can be covered.
- Create a task with hyperlink as content
- Create a task with executable script as content
- Create a task with html as content
## Test Automation
### Architecture
The solution uses Playwright for UI actions, and given the simplicity of the application, there is no need for additional abstraction over it. 
It also follows the Page Object model, in a more contextualized manner. By introducing a context fixture, we can have a centralized place for both Playwright's direct use, while also enabling access to all Page Objects, either from the test themselves, or from one Page Object into another.
Although not needer for this project, the framework allows for easy integration of separate API Framework (abstraction over Playwrights' Requests or any standalone API library) and API Objects, registered in the Context with their separate ApiRegister class.
#### Folder Structure
```text
hs_todo_assignment/
├── .github/
│   └── workflows/
│       └── workflow.yml
│       └── docker-workflow.yml
├── core/
│   └── helpers.ts              # Common helper functions unrelated to UI/API
│   └── context.ts              # Context definition and fixture enablement
│   └── regtisters.ts           # Simple Register classes for allowing API & Page Object access via the Context variable
├── data/
│   └── predefinedList.json 
├── dsl/
│   ├── web/
│   │   └── todoPage.ts
│   │   └── <pageObject>.ts     # any other Page Object file
├── tests/
│   ├── web/
│   │   └── functional.spec.ts
│   │   └── security.spec.ts
```
#### Reporting
To accomodate the assignment reporting requirements, the choice fell on Allure, as it hits all the checkboxes out of the box with minimal configuration. That being said, it adds to the folder structure as follows:
```text
hs_todo_assignment/
├── allure-results/     # Store for all execution JSONs and assets
├── allure-report/      # Generated report
└── allurerc.json       # Configuration file
└── history.jsonl       # Single file containing aggregated historical trends
```
#### CI
By leveraging GitHub Actions, the solution features two workflows for executing the test suite:
- Docker-based workflow, which packages both the app under test and the automation framework in a docker and executes
- Direct checkout and execute workflow, which doesnt feature any dockerisation
The repository also has GitHub Pages enabled, so the Allure report is freshly generated after each workflow dispatch and published to the GitHub Page (https://miroslaff.github.io/hs_todo_assignment/)

## Setup & Execution Guide

Follow these instructions to set up, install, and execute the test suite locally (native) or within Docker.

---

### Prerequisites: Node.js Installation

Ensure you have **Node.js** (v20 or higher) installed on your system before running tests natively.

#### macOS / Linux
Use `nvm` (Node Version Manager) or Homebrew:
```bash
# Using NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
nvm install 22
nvm use 22

# Or using Homebrew on macOS
brew install node
```

#### Windows
Download and run the installer from the official [Node.js Website](https://nodejs.org/) (LTS version recommended).

#### Verify Installation
```bash
node -v
npm -v
```

---

### Option 1: Native Setup & Execution (Non-Docker)

#### 1. Clone the Main Repository
```bash
git clone <repository-url>
cd hs_todo_assignment
```

#### 2. Clone the Target Application
Clone the target application (`cypress-example-kitchensink`) directly into the `./app` folder:
```bash
git clone https://github.com/cypress-io/cypress-example-kitchensink.git ./app
```

#### 3. Install Dependencies
Install dependencies for both the target application and the root test suite:
```bash
# Install target app dependencies
cd app && npm install && cd ..

# Install test suite dependencies
npm install

# Install Playwright browser binaries
npx playwright install chromium
```

#### 4. Start the Application & Run Tests
Open a terminal and start the target web application:
```bash
cd app
npm start
```
*(The application will be accessible at `http://localhost:8080`)*

In a **second terminal window** from the root project directory, execute the Playwright test suite:
```bash
npm test
```

#### 5. Generate and View Local Allure 3 Report
```bash
# Generate report from test results
npx allure generate allure-results --clean

# Open report in your default browser
npx allure open allure-report
```

---

### Option 2: Containerized Execution (Docker)

Running via Docker packages the environment, Node.js, Playwright browsers, and the target application into an isolated container.

#### Prerequisites
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

#### 1. Clone the Main Repository
```bash
git clone <repository-url>
cd hs_todo_assignment
```

#### 2. Build the Docker Image
Docker will automatically clone the target application into `./app`, install dependencies, and prepare the Playwright environment during the build:
```bash
docker build -t hs-todo-suite .
```

#### 3. Run Tests inside Docker
Execute the tests inside the container and mount `allure-results` back to your local machine:

* **macOS / Linux / Git Bash:**
  ```bash
  docker run --rm --ipc=host -v $(pwd)/allure-results:/app/allure-results hs-todo-suite
  ```

* **Windows PowerShell:**
  ```powershell
  docker run --rm --ipc=host -v ${PWD}/allure-results:/app/allure-results hs-todo-suite
  ```

#### 4. View Allure Report (Generated from Docker Output)
After the container completes the run, view the generated results on your local machine:
```bash
npx allure generate allure-results --clean
npx allure open allure-report
```

## Future Improvements
### Coverage
The current suite of tests can be considered a "smoke suite", but its far from enough. Introducing more randomized tests, including one that perform actions on more than one task, and even testing the task count limitations is a good place to start improving on the coverage.
