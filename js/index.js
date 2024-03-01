const form = document.querySelector('form')
const inputDado = form.querySelector('[data-dado]')
const inputResult = form.querySelector('.form-result')
const fieldset = form.querySelector('fieldset')
let formSystem =form.dataset.system

const user = {
  metric: {
    cm:null,
    kg:null
  },
  imperial:{
    ft:null,
    inc:null,
    st:null, 
    lbs:null
  }
}

const InputsRadio = document.querySelectorAll('input[type="radio"]')

InputsRadio.forEach(radio => {
  radio.addEventListener('change', changeHtml) 
});

form.addEventListener('input',e=>{

  const inputData = e.target.dataset.dado
  const inputValue = parseInt(e.target.value)
  const input = e.target 
  const inputId = input.id  
  saveData(inputData, inputId,inputValue)
  ConvertValues(formSystem)

  if(validData()){
    imc()        
  }else{
    inputResult.innerHTML =`<h2>Welcome!</h2>
    <p>Enter your weight and your height and you'll see your BMI results here</p>`
  }
        
  function imc(){
     const imcDiagnostico = [
     { imcRange: [0.1, 18.49], diagnostico: `Your BMI suggests you're underweight. Your ideal weight is between <span class="bold">${idealWeight(formSystem)}</span`},
     { imcRange: [18.5, 24.9], diagnostico:`Your BMI suggests you're a helthy weight. Your ideal weight is between <span class="bold">${idealWeight(formSystem)}</span>`},
     { imcRange: [24.9, 30], diagnostico: `Your bmi suggests you're overweight. your ideal weight is between <span class="bold">${idealWeight(formSystem)}</span>` },
     { imcRange: [29.9, 350], diagnostico: `Your bmi suggests you're obese. your ideal weight is between <span class="bold">${idealWeight(formSystem)}</span>`}
     ]
    
    
    const calcImc = (height, weight)=>{
      let imc = weight/( height**2)
      return imc
    } 
    
    const dataType = system => {
      const { metric, imperial } = user
      const systemInfo = {
        metric: {
          height: metric.cm / 100,
          weight: metric.kg
        },
        imperial: {
          height: (imperial.ft * 12 + imperial.inc) * .0254,
          weight: (imperial.st * 14 + imperial.lbs) * .454
        }
      }
      const { height, weight } = systemInfo[system]
      return calcImc(height, weight)
    };
    
     
     const bmi = dataType(formSystem)
     
    function getDiagnosis(imc) {
      const diagnosticoObj = imcDiagnostico.find(({imcRange}) => imc >= imcRange[0] && imc <= imcRange[1])
      return diagnosticoObj ? diagnosticoObj.diagnostico : 'Out of Range!'
    }
    
    const diagnostico = getDiagnosis(bmi)    
    
    
    function idealWeight(system) {
      const{metric:{cm}} = user
      const{metricWeight, imperialWeight}={
        metricWeight: {
          minMetricalWeight:`${((cm/100)**2 *18.49).toFixed(1)} kg`,
          maxMetricalWeight:`${((cm / 100) ** 2*24.9).toFixed(1)} kg`
        },
        imperialWeight: {
          minImperialWeight:`${(((cm / 100) ** 2 * 18.49) * 2.2042).toFixed(1)} lbs`,
          maxImperialWeight:`${(((cm/100) ** 2* 24.9)* 2.2042).toFixed(1)} lbs`
        }
      }
    
      const intervalIdealWeight = system === 'metric' ? `${metricWeight.minMetricalWeight} - ${metricWeight.maxMetricalWeight}` : `${imperialWeight.minImperialWeight} - ${imperialWeight.maxImperialWeight}`
      return intervalIdealWeight
    }
    
    
  
    inputResult.innerHTML =`<div>
    <p>Your BMI is...</p>
    <h2 class="bold">${bmi.toFixed(1)}</h2>
    <p>${diagnostico}</p>
  </div> `   
    }
     
  })  

  function changeHtml(){
    if(this.getAttribute('id') === 'imperial'){
    formSystem= 'imperial'
      fieldset.innerHTML = 
    `<label class="form__user-data-name">Height</label> 
    <div class="fieldset__container">
      <div class="form__container margin-bottom">
      <input type="number" class="form__user-data-number" data-dado="imperial" placeholder="0" id="ft">
      <label>ft</label>
      </div>
      <div class="form__container margin-bottom">
        <input type="number" class="form__user-data-number" data-dado="imperial" placeholder="0" id="inc">
        <label>in</label>
      </div>
    </div>

    <label class="form__user-data-name">Weight</label>
    <div class="fieldset__container">
      <div class="form__container margin-bottom">
      <input type="number" class="form__user-data-number" data-dado="imperial" placeholder="0" id="st">
        <label>st</label>
        </div>
      <div class="form__container margin-bottom">
        <input type="number" class="form__user-data-number " data-dado="imperial" placeholder="0" id="lbs">
        <label>lbs</label>
        </div>
        </div>
        `;
  }
  else{
    formSystem = 'metric'
    fieldset.innerHTML = 
    `<label class="form__user-data-name">Height</label> 
    <div class="form__container margin-bottom">
      <input type="number" class="form__user-data-number " data-dado="metric" id="cm" placeholder="0">
      <label>cm</label>
    </div>

    <label class="form__user-data-name">Weight</label>
    <div class="form__container margin-bottom">
    <input type="number" class="form__user-data-number " data-dado="metric" id="kg" placeholder="0" >
    <label>kg</label>
    </div>
    `;
    
  }
}

function saveData(system, id, value) {
  if (user[system].hasOwnProperty(id)) {
    user[system][id] = isNaN(value) ? 0 : value
  }
}


function validData(){
  const {metric, imperial} = user
  const metricSystem = metric.cm && metric.kg
  const imperialSystem = ((imperial.ft ||imperial.inc) && (imperial.lbs || imperial.st))
  return metricSystem || imperialSystem
}



function ConvertValues(system) {
  if (system === 'metric') {
    const { cm, kg } = user.metric

    let adjustedCm = cm || 0
    let adjustedKg = kg || 0

    let ft = Math.floor(adjustedCm / 30.48)
    let inc = Math.round((adjustedCm % 30.48) / 2.54)

    if (inc >= 12) {
      ft += Math.floor(inc / 12)
      inc %= 12
    }

    let lbs = Math.round(adjustedKg * 2.20462)

    let st = 0
    if (lbs >= 14) {
      st = Math.floor(lbs / 14)
      lbs %= 14
    }

    user.imperial.ft = ft
    user.imperial.inc = inc
    user.imperial.st = st
    user.imperial.lbs = lbs
  } else if (system === 'imperial') {
    const { ft, inc, st, lbs } = user.imperial

    let adjustedFt = ft || 0
    let adjustedInc = inc || 0
    let adjustedSt = st || 0
    let adjustedLbs = lbs || 0

    let kg = adjustedSt * 6.35029 + adjustedLbs * 0.453592

    if (adjustedLbs >= 14) {
      adjustedSt += Math.floor(adjustedLbs / 14)
      adjustedLbs %= 14
    }

    let cm = adjustedFt * 30.48 + adjustedInc * 2.54

    user.metric.cm = cm
    user.metric.kg = kg
  }
}
