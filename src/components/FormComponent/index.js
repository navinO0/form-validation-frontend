import {useState} from 'react'
import {useForm} from 'react-hook-form'
import {TailSpin} from 'react-loader-spinner'
import {Link} from 'react-router-dom'
import axios from 'axios'
import * as yup from 'yup'

import {religionsInIndia, citiesByState, bloodGroups} from '../Resources'
import './index.css'

const states = Object.keys(citiesByState) // For getting States data

const schema = yup.object().shape({
  name: yup.string().required(),
  aadhaarNumber: yup
    .string()

    .optional(),
  age: yup
    .string()

    .required(),
  mobileNumber: yup.string().optional(),
  address: yup.string().optional(),
  city: yup.string().optional(),
  gender: yup
    .string()
    .oneOf(['male', 'female', 'other'], 'Select gender')
    .required('Select gender'),
  govtId: yup.string().optional(),

  country: yup.string().optional(),
  email: yup.string().email('Enter valid email').optional(),
  emergencyNumber: yup.string().optional(),
  gardian: yup.string().optional(),
  guardianType: yup.string().optional(),
  maritalStatus: yup.string().optional(),
  nationality: yup.string().optional(),
  occupation: yup.string().optional(),
  pincode: yup.string().nullable().optional(),
  religion: yup.string().optional(),
  state: yup.string().optional(),
})

const FormComponent = () => {
  const [idType, setIdType] = useState('AADHAR')
  const [loading, setLoading] = useState(false) // For showing loading screen during submission
  const [errorsMsg, setErrorMsg] = useState('') // If there is error during submission process.
  const {
    register,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm()

  const [citiesList, setCitiesList] = useState([]) // For getting cities list according to the state.

  const onChangeStateSelectElement = event => {
    const citiesListFromObj = citiesByState[event.target.value]
    setCitiesList(citiesListFromObj)
  }

  const onChangeId = event => {
    setIdType(event.target.value)
  }

  const onSubmit = async data => {
    try {
      setErrorMsg('')
      setLoading(true) // to disploy loader during post.
      const validateOutput = await schema.validate(data, {abortEarly: false}) // Validate using Yup validation library.

      const response = await axios.post(
        'https://formservicebynavin.onrender.com/person',
        validateOutput,
      )

      if (response.status === 200) {
        setLoading(false)
        setErrorMsg('Successfully submitted')
        reset({
          name: '',
          age: '',
          gender: '',
          mobileNumber: '',
          govtId: '',
          aadhaarNumber: '',
          guardianType: '',
          guardian: '',
          email: '',
          emergencyNumber: '',
          address: '',
          state: '',
          city: '',
          country: 'India',
          pincode: '',
          occupation: '',
          religion: '',
          maritalStatus: '',
          bloodGroup: '',
          nationality: 'Indian',
          panNumber: '',
        })
      } else {
        setErrorMsg('Register failed Due to Network Issue')
      }
    } catch (e) {
      setErrorMsg(e.errors[0])
    }
  } // form submit function which will invoke after successful validation

  return (
    <>
      <div className="form-component-main-container">
        <form onSubmit={handleSubmit(onSubmit)} className="form-container">
          <h1 className="section-heading">Personal Details</h1>
          <div className="section-container">
            <div className="input-field-error-container">
              <label htmlFor="firstName" className="label">
                Name<span className="span">*</span>
              </label>
              <div className="error-input-container">
                <input
                  className="input-field"
                  placeholder="Enter Name"
                  id="firstName"
                  {...register('name', {
                    required: true,
                    maxLength: 20,
                    pattern: /^[A-Za-z+" "]+$/i,
                  })}
                />
                {errors?.name?.type === 'required' && (
                  <p className="error-message">*Required</p>
                )}
                {errors?.name?.type === 'maxLength' && (
                  <p className="error-message">
                    *First name cannot exceed 20 characters
                  </p>
                )}
                {errors?.name?.type === 'pattern' && (
                  <p className="error-message">*Alphabetical characters only</p>
                )}
              </div>
            </div>

            <div className="input-field-error-container">
              <label htmlFor="age" className="label">
                Age<span className="span">*</span>
              </label>
              <div className="error-input-container">
                <input
                  type="number"
                  placeholder="Age in Years"
                  className="input-field"
                  id="age"
                  {...register('age', {
                    min: {
                      value: 18,
                      message: 'You must be at least 18 years old',
                    },
                    max: {
                      value: 120,
                      message: 'You cannot be more than 120 years old',
                    },
                    required: true,
                  })}
                />
                {errors?.age?.type === 'required' && (
                  <p className="error-message">*Required</p>
                )}
                {errors?.age?.type ===
                  ('max' && (
                    <p className="error-message">
                      You Must be older then 18 and younger then 99 years old
                    </p>
                  ))}
                {errors?.age?.type === 'min' && (
                  <p className="error-message">
                    You Must be older then 18 and younger then 99 years old
                  </p>
                )}
              </div>
            </div>
            <div className="input-field-error-container">
              <label className="label" htmlFor="sexOpt">
                Sex<span className="span">*</span>
              </label>
              <div className="error-input-container">
                <select
                  id="sexOptc"
                  className="select-element"
                  {...register('gender', {required: true})}
                >
                  <option value="">Enter Sex</option>
                  <option value="female">female</option>
                  <option value="male">male</option>
                  <option value="other">other</option>
                </select>

                {errors?.gender?.type === 'required' && (
                  <p className="error-message">*Required</p>
                )}
              </div>
            </div>

            <div className="input-field-error-container">
              <label htmlFor="mobileNo" className="label">
                Mobile
              </label>
              <div className="error-input-container">
                <input
                  placeholder="Enter Mobile"
                  id="mobileNo"
                  className="input-field"
                  type="tel"
                  {...register('mobileNumber', {
                    pattern: /^[0-9 v]+$/,
                    minLength: 10,
                    maxLength: 10,
                  })}
                />
                {errors.mobileNumber && (
                  <p className="error-message">
                    *Number must contain 10 digits
                  </p>
                )}
              </div>
            </div>
            <div className="input-field-error-container">
              <p className="label">Govt Id Type</p>
              <select
                className="select-element"
                {...register('govtId')}
                onChange={onChangeId}
              >
                <option value=""> ID Type</option>
                <option value="AADHAR">Aadhar</option>
                <option value="PAN">PAN</option>
              </select>
              {idType === 'AADHAR' ? (
                <div className="error-input-container">
                  <input
                    placeholder="Enter Govt ID"
                    className="input-field"
                    type="number"
                    {...register('aadhaarNumber', {
                      pattern: /^[0-9+-]+$/,
                      minLength: 12,
                      maxLength: 12,
                    })}
                  />
                  {errors.aadhaarNumber && (
                    <p className="error-message">enter valid Aadhaar number</p>
                  )}
                </div>
              ) : (
                <div className="error-input-container">
                  <input
                    className="input-field"
                    type="text"
                    placeholder="Enter Govr ID"
                    {...register('panNumber', {
                      pattern: /^[a-zA-Z0-9-/]*$/,
                      minLength: 10,
                      maxLength: 10,
                    })}
                  />
                  {errors.panNumber && (
                    <p className="error-message">enter valid pan number</p>
                  )}
                </div>
              )}
            </div>
          </div>
          <h1 className="section-heading">Contact details</h1>
          <div className="section-container">
            <div className="input-field-error-container">
              <label htmlFor="guardian" className="label">
                guardian
              </label>
              <select className="select-element" {...register('guardianType')}>
                <option value="">Enter Label </option>
                <option value="S/O">S/o</option>
                <option value="D/O">D/o</option>
                <option value="W/O">W/o</option>
                <option value="H/O">H/O</option>
                <option value="C/O">C/O</option>
              </select>
              <div className="error-input-container">
                <input
                  placeholder="Enter Guardian Name"
                  className="input-field"
                  id="guardian"
                  {...register('guardian', {
                    maxLength: 20,
                    pattern: /^[A-Za-z+" "]+$/i,
                  })}
                />

                {errors?.guardian?.type === 'maxLength' && (
                  <p className="error-message">
                    *First name cannot exceed 20 characters
                  </p>
                )}
                {errors?.guardian?.type === 'pattern' && (
                  <p className="error-message">Alphabetical characters only</p>
                )}
              </div>
            </div>
            <div className="input-field-error-container">
              <label htmlFor="guardian" className="label">
                Email
              </label>
              <div className="error-input-container">
                <input
                  placeholder="Enter Email"
                  className="input-field"
                  id="email"
                  {...register('email', {
                    pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                  })}
                />

                {errors?.email?.type === 'pattern' && (
                  <p className="error-message">*Enter valid Email ID</p>
                )}
              </div>
            </div>
            <div className="input-field-error-container">
              <label htmlFor="EmergencyMobileNo" className="label">
                Emergency Mobile
              </label>
              <div className="error-input-container">
                <input
                  placeholder="Enter Emergency No"
                  id="EmergencyMobileNo"
                  className="input-field"
                  type="tel"
                  {...register('emergencyNumber', {
                    pattern: /^[0-9+-]+$/,
                    minLength: 10,
                    maxLength: 10,
                    optional: true,
                  })}
                />
                {errors.emergencyNumber && (
                  <p className="error-message">Number must contain 10 digits</p>
                )}
              </div>
            </div>
          </div>
          <h1 className="section-heading">Address Details</h1>
          <div className="section-container">
            <div className="input-field-error-container">
              <label htmlFor="addressInp" className="label">
                Address
              </label>
              <div className="error-input-container">
                <input
                  placeholder="Enter Address"
                  className="input-field"
                  id="addressInp"
                  {...register('address')}
                />
              </div>
            </div>
            <div className="input-field-error-container">
              <label htmlFor="state" className="label">
                State
              </label>
              <select
                className="select-element-state-city"
                {...register('state')}
                onChange={onChangeStateSelectElement}
              >
                <option value="" defaultChecked>
                  Select State
                </option>
                {states.map(eachState => (
                  <option value={eachState} key={eachState}>
                    {eachState}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-field-error-container">
              <label htmlFor="city" className="label">
                City
              </label>

              <select
                className="select-element-state-city"
                {...register('city')}
              >
                <option value="" defaultChecked>
                  Select City
                </option>
                {citiesList.map(eachState => (
                  <option value={eachState} key={eachState}>
                    {eachState}
                  </option>
                ))}
              </select>
            </div>
            <div className="input-field-error-container">
              <label htmlFor="country" className="label">
                Country
              </label>

              <input
                className="input-field"
                id="country"
                type="search"
                {...register('country', {value: 'India'})}
              />
            </div>
            <div className="input-field-error-container">
              <label htmlFor="pincode" className="label">
                Pin Code
              </label>
              <div className="error-input-container">
                <input
                  placeholder="Enter Pincode"
                  className="input-field"
                  id="pincode"
                  {...register('pincode', {
                    maxLength: 6,
                    minLength: 6,

                    pattern: /^[0-9+-]+$/i,
                  })}
                />

                {errors?.pincode?.type === 'maxLength' && (
                  <p className="error-message">*Enter valid 6 digit pincode</p>
                )}
                {errors?.pincode?.type === 'minLength' && (
                  <p className="error-message">*Enter valid 6 digit pincode</p>
                )}
                {errors?.pincode?.type === 'pattern' && (
                  <p className="error-message">*Alphabetical characters only</p>
                )}
              </div>
            </div>
          </div>
          <h1 className="section-heading">Other details</h1>
          <div className="section-container">
            <div className="input-field-error-container">
              <label htmlFor="occupation" className="label">
                Occupation
              </label>
              <div className="error-input-container">
                <input
                  placeholder="Enter occupation"
                  className="input-field"
                  id="occupation"
                  {...register('occupation')}
                />
              </div>
            </div>
            <div className="input-field-error-container">
              <label htmlFor="religion" className="label">
                Religion
              </label>

              <select
                className="select-element-state-city"
                {...register('religion')}
              >
                <option value="" defaultChecked>
                  Enter Religion
                </option>
                {religionsInIndia.map(eachState => (
                  <option value={eachState} key={eachState}>
                    {eachState}
                  </option>
                ))}
              </select>
            </div>
            <div className="input-field-error-container">
              <label htmlFor="maritalStatus" className="label">
                Marital Status
              </label>
              <select
                className="select-element-state-city"
                {...register('maritalStatus')}
              >
                <option value="" defaultChecked>
                  Enter Marital Status
                </option>
                <option value="unmarried">Unmarried</option>
                <option value="married">Married</option>
              </select>
            </div>
            <div className="input-field-error-container">
              <label htmlFor="bloodGroup" className="label">
                Blood Group
              </label>
              <select className="select-element" {...register('bloodGroup')}>
                <option value="" defaultChecked>
                  Group
                </option>
                {bloodGroups.map(eachState => (
                  <option value={eachState} key={eachState}>
                    {eachState}
                  </option>
                ))}
              </select>
            </div>
            <div className="input-field-error-container">
              <label htmlFor="nationality" className="label">
                Nationality
              </label>
              <div className="error-input-container">
                <input
                  className="input-field"
                  type="search"
                  id="nationality"
                  {...register('nationality', {value: 'India'})}
                />
              </div>
            </div>
          </div>
          <div className="buttons-container">
            <Link to="/" className="link-item">
              <button type="button" className="cancel-btn">
                Cancel
              </button>
            </Link>
            <div className="error-input-container button-aling">
              <button type="submit" className="submit-button">
                {loading ? (
                  <TailSpin
                    height="25"
                    width="50"
                    color="#ffffff"
                    ariaLabel="tail-spin-loading"
                    radius="1"
                    wrapperClass=""
                    visible
                  />
                ) : (
                  'Submit'
                )}
              </button>
              {errorsMsg && <p className="error-message">{errorsMsg}</p>}
            </div>
          </div>
        </form>
      </div>
    </>
  )
}

export default FormComponent
