import React, { PureComponent } from 'react';

class SpendingForm extends PureComponent {
  render() {
    const {data, updateFn} = this.props;
    return (
      <form>
        {Object.entries(data).map(([category, subcategories]) => (
          <div key={`${category}`}>
            {Object.entries(subcategories).map(([subcategory, value]) => (
              <label key={`${category}-${subcategory}`}>
                {`${category}: ${subcategory}`}
                <input type="number" value={value} onChange={(e) => updateFn({category, subcategory, e})}/>
              </label>)
            )}
          </div>
        ))}
      </form>
    )
  }
}

export default SpendingForm
