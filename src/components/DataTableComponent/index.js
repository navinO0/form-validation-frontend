import {useEffect, useState} from 'react'
import {MagnifyingGlass} from 'react-loader-spinner'
import axios from 'axios'
import 'datatables.net'
import DataTable, {createTheme} from 'react-data-table-component'
import {CSVLink} from 'react-csv'
import './index.css'

const DataTablesComponent = () => {
  const [data, setData] = useState([])
  const [pending, setPending] = useState(true)
  const [searchKey, setSearchKey] = useState('')

  useEffect(() => {
    const getDets = async () => {
      setPending(true)
      const retrivedData = await axios.get(
        'https://formservicebynavin.onrender.com/person/',
      )

      const recievedData = retrivedData.data
      const formattedData = recievedData.map(e => {
        const {
          govtId,
          id,
          nationality,
          aadhaarNumber,
          panNumber,
          address,
          city,
          state,
          country,
          pincode,
          gender,
          age,
          name,
          guardianName,
          guardianType,
          mobileNumber,
        } = e

        const rowId = govtId === 'AADHAR' ? aadhaarNumber : panNumber

        const validGuardian =
          guardianName === 'undefined'
            ? '--'
            : `${guardianType}  ${guardianName}`
        const yname = name
        const ynationality = nationality
        const ygovtId = `${rowId}`
        const yaddress = `${address}, ${city}, ${state}, ${country}, (${pincode}).`
        const yformattedGender = gender === 'male' ? 'M' : 'F'
        const yageGender = `${age}Y/${yformattedGender}`
        const yguardianDetails = validGuardian
        const ymoblieNumber = mobileNumber
        const ygovtIdType = govtId
        return {
          yname,
          id,
          ygovtIdType,
          ynationality,
          ygovtId,
          yaddress,
          yformattedGender,
          yageGender,
          yguardianDetails,
          ymoblieNumber,
        }
      })

      setData(formattedData)
      setPending(false)
    }
    getDets()
  }, [])

  createTheme(
    'solarized',
    {
      text: {
        primary: '#268bd2',
        secondary: '#2aa198',
      },
      background: {
        default: '#002b36',
      },
      context: {
        background: '#cb4b16',
        text: '#FFFFFF',
      },
      divider: {
        default: '#073642',
      },
      action: {
        button: 'rgba(0,0,0,.54)',
        hover: 'rgba(0,0,0,.08)',
        disabled: 'rgba(0,0,0,.12)',
      },
    },
    'dark',
  )

  const customStyles = {
    rows: {
      style: {
        minHeight: '59px',
      },
    },
    columns: {
      style: {
        minHeight: '59px',
      },
    },
    headCells: {
      style: {
        paddingLeft: '9px',
        paddingRight: '2px',
        backgroundColor: '#43a885',
        borderLeft: 'solid #000000 1px',
        textAlign: 'center',
        width: 'auto',
      },
    },
    cells: {
      style: {
        fontFamily: 'Roboto',
        paddingLeft: '10px',
        paddingRight: '4px',
        width: 'auto',
        grow: '1',
      },
    },
  }

  const columns = [
    {
      name: 'Id',
      selector: row => (row.id === undefined ? '--' : row.id),
      sortable: true,
      width: '30px',
    },
    {name: 'Name', selector: row => row.yname, width: '200px'},
    {name: 'Age/sex', selector: row => row.yageGender, width: '70px'},

    {
      name: 'Mobile',
      selector: row =>
        row.ymoblieNumber === 'undefined' ? '--' : row.ymoblieNumber,
      width: '150px',
    },
    {name: 'Address', selector: row => row.yaddress},

    {
      name: 'Govt Id Type',
      selector: row =>
        row.ygovtIdType === 'undefined' ? '--' : row.ygovtIdType,
      width: '100px',
    },
    {
      name: 'Govt Id',
      selector: row => (row.ygovtId === 'undefined' ? '--' : row.ygovtId),
      width: '120px',
    },
    {name: 'Guardian', selector: row => row.yguardianDetails, width: '150px'},
    {name: 'Nationality', selector: row => row.ynationality, width: '80px'},
  ]

  const headers = [
    {label: 'Id', key: 'id'},
    {label: 'Name', key: 'yname'},
    {label: 'Age/sex', key: 'yageGender'},

    {label: 'Mobile', key: 'ymoblieNumber'},
    {label: 'Address', key: 'yaddress'},

    {label: 'Govt Id Type', key: 'ygovtIdType'},
    {label: 'Govt Id', key: 'ygovtId'},
    {label: 'Guardian', key: 'yguardianDetails'},
    {label: 'Nationality', key: 'ynationality'},
  ]

  const onChangeSearchKey = event => {
    setSearchKey(event.target.value)
  }

  const searchFilteredData = data.filter(eachIteral =>
    eachIteral.yname.toLowerCase().includes(searchKey.toLowerCase()),
  )

  return (
    <div className="data-table-container">
      <div className="csv-search-container">
        <CSVLink data={data} headers={headers}>
          <button type="button" className="button">
            Download
          </button>
        </CSVLink>

        <div className="search-component">
          <label htmlFor="search" className="label">
            Search
          </label>
          <input
            type="search"
            id="search"
            className="input-field"
            onChange={onChangeSearchKey}
            placeholder="Search"
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={searchFilteredData}
        striped
        responsive
        pagination
        fixedHeader
        subHeaderWrap
        dense
        progressComponent={
          <div className="loader-table">
            <MagnifyingGlass
              visible
              height="80"
              width="80"
              ariaLabel="MagnifyingGlass-loading"
              wrapperStyle={{}}
              wrapperClass="MagnifyingGlass-wrapper"
              glassColor="#c0efff"
              color="#e15b64"
            />
          </div>
        }
        progressPending={pending}
        customStyles={customStyles}
        paginationPerPage={17}
        persistTableHead
        grow
      />
    </div>
  )
}
export default DataTablesComponent
