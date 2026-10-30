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
│       └── ci.yml
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