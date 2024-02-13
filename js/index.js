const form = document.querySelector('form')
const inputDado = form.querySelector('[data-dado]')
const inputResult = form.querySelector('.form-result')
const fieldset = form.querySelector('fieldset')

const user = {
  metric: {
    height:null,
    weight:null
  },
  imperial:{
    ft:null,
    inc:null,
    st:null, 
    lbs:null
  }
}

form.addEventListener('input',e=>{
  
  const inputData = e.target.dataset.dado
  const inputValue = parseInt(e.target.value)
  const input = e.target 
  const inputId = input.id

  if(form.dataset.sistem === 'metric'){
    switch (inputData) {
      case 'height':
      user.metric.height = inputValue
      break;
      case 'weight':
      user.metric.weight = inputValue
      break;
      default:
      break;}
  }
  else{
    if (user.imperial.hasOwnProperty(inputId))
      user.imperial[inputId] = inputValue
   }
        
        if(user.metric.height && user.metric.weight){
          imc()
          onlyNumbers(e)
        }else{
          inputResult.innerHTML =`<h2>Welcome!</h2>
          <p>Enter your weight and your height and you'll see your BMI results here</p>`
        }
      
      function imc(){
    let metros = user.metric.height / 100
    const imc = user.metric.weight/(metros**2) 
    
    const imcDiagnostico = [

      { imcRange: [0.1, 18.49], diagnostico: `Your BMI suggests you're underweight. Your ideal weight is between <span class="bold">${idealWeight()}`},
      { imcRange: [18.5, 24.9], diagnostico:`Your BMI suggests you're a helthy weight. Your ideal weight is between <span class="bold">${idealWeight()}`},
      { imcRange: [25, 30], diagnostico: `your bmi suggests you're overweight. your ideal weight is between <span class="bold">${idealWeight()}` },
      { imcRange: [30, 350], diagnostico: `your bmi suggests you're obese. your ideal weight is between <span class="bold">${idealWeight()}`}
    ]
    
    function getDiagnosis(imc) {
      const diagnosticoObj = imcDiagnostico.find(({imcRange}) => imc >= imcRange[0] && imc <= imcRange[1])
      return diagnosticoObj ? diagnosticoObj.diagnostico : 'Out of Range!'
    }
    
    const diagnostico = getDiagnosis(imc)    

    function idealWeight(){
      const minWeight = (metros**2 * 18.5)
      const maxWeight= (metros**2 * 24.9)
      const intervalIdealWeight = `${minWeight.toFixed(1)}kg - ${maxWeight.toFixed(1)}kg`
      return intervalIdealWeight
    }
  
    
    inputResult.innerHTML = `<p>Your BMI is...</p>
    <h2 class="bold">${imc.toFixed(1)}</h2>
    <p>${diagnostico}</p>
  </div> `   
  
  }
  
  function onlyNumbers(e){
    const char = e.data
    const numbers = /[0-9]/
    if (!numbers.test(char))
      e.preventDefault()
  }
})  

const InputsRadio = document.querySelectorAll('input[type="radio"]')

InputsRadio.forEach(radio => {
  radio.addEventListener('click', changeHtml) 
});

function changeHtml(){
  if(this.getAttribute('id') === 'imperial'){
    form.dataset.sistem = 'imperial'
    fieldset.innerHTML = 
    `<label class="form__user-data-name">Height</label> 
    <div class="fieldset__container">
      <div class="form__container margin-bottom">
        <input type="number" class="form__user-data-number" "data-dado="height" placeholder="0" id="ft">
        <label>ft</label>
      </div>
      <div class="form__container margin-bottom">
        <input type="number" class="form__user-data-number" "data-dado="height" placeholder="0" id="inc">
        <label>in</label>
      </div>
    </div>

    <label class="form__user-data-name">Weight</label>
    <div class="fieldset__container">
      <div class="form__container margin-bottom">
        <input type="number" class="form__user-data-number" data-dado="weight" placeholder="0" id="st">
        <label>st</label>
      </div>
      <div class="form__container margin-bottom">
        <input type="number" class="form__user-data-number " data-dado="weight" placeholder="0" id="lbs">
        <label>lbs</label>
      </div>
    </div>
    `
    
  }
  else{
    form.dataset.system = 'metric'
    fieldset.innerHTML = 
    `<label class="form__user-data-name">Height</label> 
    <div class="form__container margin-bottom">
      <input type="number" class="form__user-data-number " data-dado="height" placeholder="0">
      <label>cm</label>
    </div>

    <label class="form__user-data-name">Weight</label>
    <div class="form__container margin-bottom">
      <input type="number" class="form__user-data-number " data-dado="weight" placeholder="0">
      <label>kg</label>
    </div>
    `
  }
}
