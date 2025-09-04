import '../src/styles/EconomyScreen.css';

const EconomyScreen: React.FC = () => {
  const budget = {
    income: {
      taxes: 850,
      socialContributions: 450,
      other: 200
    },
    expenses: {
      socialProtection: 600,
      education: 250,
      defense: 150,
      debt: 100
    },
    deficit: -50,
    debt: 2500,
    gdpGrowth: 1.2,
    inflation: 2.5
  };

  return (
    <div className="economy-screen">
      <div className="economy-header">
        <h2>Tableau de bord économique</h2>
        <div className="main-indicators">
          <div className="indicator">
            <span className="indicator-label">Croissance</span>
            <span className="indicator-value positive">+{budget.gdpGrowth}%</span>
          </div>
          <div className="indicator">
            <span className="indicator-label">Inflation</span>
            <span className="indicator-value warning">{budget.inflation}%</span>
          </div>
          <div className="indicator">
            <span className="indicator-label">Dette</span>
            <span className="indicator-value">{budget.debt}Mds€</span>
          </div>
        </div>
      </div>

      <div className="budget-section">
        <div className="income-section">
          <h3>Recettes</h3>
          {Object.entries(budget.income).map(([source, amount]) => (
            <div key={source} className="budget-item">
              <span className="item-name">{source}</span>
              <span className="item-amount">{amount}Mds€</span>
            </div>
          ))}
        </div>

        <div className="expenses-section">
          <h3>Dépenses</h3>
          {Object.entries(budget.expenses).map(([category, amount]) => (
            <div key={category} className="budget-item">
              <span className="item-name">{category}</span>
              <span className="item-amount">{amount}Mds€</span>
            </div>
          ))}
        </div>
      </div>

      <div className="economic-actions">
        <button className="btn-reform">Proposer une réforme</button>
        <button className="btn-stimulus">Plan de relance</button>
        <button className="btn-austerity">Plan d'austérité</button>
      </div>
    </div>
  );
};

export default EconomyScreen;