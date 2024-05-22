const addContext = require('mochawesome/addContext');

describe('Voyant automation exercise', () => {
  it('Should create a new client with Goal, Income, Employment and Insurance', function () {
    // Login
    cy.visit('https://ca-test.planwithvoyant.com/advisergo')
    cy.get('#id').click().type("voyant-exercise")
    cy.get('#pw').type("password100")
    cy.get('.btn').click()
    cy.get('.modal-icon').click()
    cy.contains("Clients").should('be.visible')
    cy.get('.brand-bar-text').click()
    cy.get('a').contains('Profile').click()
    cy.get('.modal-content').within(() => {
      cy.get('#profileFirstName').should('have.value', 'Voyant')
      cy.get('#profileLastName').should('have.value', 'Exercise')
      cy.screenshot('Login')
      cy.get('button').contains('Cancel').click()
      cy.addTestContext('| Test Case | Result | Screenshot |')
      cy.addTestContext('| Login | PASSED | Login.png |')
    });    
    cy.fixture('client.json').then((client) => {
      // Add Client
      cy.get('.add-button').click()
      cy.wait(500)
      cy.get('#newInputFirst').type(client.first_name);
      cy.get('#newInputLast').type(client.last_name);
      cy.get('#birthYear').type(client.birth_year);
      cy.get('input[placeholder="MM"]').clear().type(client.plan_start_date.month)
      cy.get('input[placeholder="DD"]').clear().type(client.plan_start_date.day)
      cy.get('input[aria-label="Plan Start Date: YYYY Year"]').clear().type(client.plan_start_date.year)
      cy.get('#newUserInputProvince').select(client.province)
      cy.get('#alreadyRetiredDropdown').select(client.retired)
      cy.get('#retirementAge').clear().type(client.retirement_age)
      cy.screenshot('AddClient')
      cy.get('button').contains('Done').click()
      // Add Pre-Retirement Goal
      cy.get('.add-button').click()
      cy.get('[data-test-model-type="goals"]').click()
      cy.get('button[data-test-goal-type="goal-pre-retirement"]').click()
      cy.wait(500)
      cy.get('#basicExpenseInputAmount').type(client.pre_retirement_goal_amount)
      cy.screenshot('AddGoal')
      cy.get('button').contains('Done').click()
      // Add Income
      cy.get('.add-button').click()
      cy.get('[data-test-model-type="income"]').click()
      cy.get('button[data-test-model-category="caEmployment"]').click()
      cy.wait(500)
      cy.get('#employmentInputName').type(client.employment.name)
      cy.get('#employmentInputEmploymentSource').select(client.employment.source)
      cy.get('#employmentInputSalary').type(client.employment.salary)
      cy.screenshot('AddIncome')
      cy.get('button').contains('Done').click()
      // Add Term Life Insurance
      cy.get('.add-button').click()
      cy.get('[data-test-model-type="protection"]').click()
      cy.get('button[data-test-model-category="termLifeInsurance"]').click()
      cy.wait(500)
      cy.get('#termLifeName').type(client.insurance.policy_name)
      cy.get('#termLifeInputInsuranceType').type(client.insurance.insurance_type)
      cy.get('#termLifeInsuranceEmploymentId').select(client.employment.name)
      cy.screenshot('AddInsurance')
      cy.get('button').contains('Done').click()
      // Validate Data in Dashboard
      // Client
      cy.get('a').contains('People').click()
      cy.contains(client.first_name + ' ' + client.last_name).should('be.visible')
      cy.addTestContext('| Create a Client using Add button  | PASSED | AddClient.png |')
      //Goal
      cy.get('a').contains('Goals').click()
      cy.contains('$50,000').should('be.visible')
      cy.contains('Pre-Retirement Goal').should('be.visible')
      cy.addTestContext('| Add a Pre-Retirement Goal  | PASSED | AddGoal.png |')
      // Income
      cy.get('a').contains('Income').click()
      cy.contains(client.employment.name).should('be.visible')
      cy.addTestContext('| Add an Income  | PASSED | AddIncome.png |')
      // Insurance
      cy.get('a').contains('Insurance').click()
      cy.contains(client.insurance.policy_name).should('be.visible')
      cy.contains('Term Life').should('be.visible')
      cy.addTestContext('| Add a Term Life Insurance  | PASSED | AddInsurance.png |')
      cy.screenshot('Dashboard')
      cy.addTestContext('| Validate Dashboard  | PASSED | Dashboard.png |')
    });
  })
})