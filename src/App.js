import React, { Component} from "react";
import "./App.css";
import * as XLSX from "xlsx";
import axios from 'axios';

// const test = 'string'
const EXTENSIONS = ['xlsx', 'xls', 'csv']
class App extends Component {
  state = {
    items : [],
    show : true,
    page_title : '',
    validations : [],
    empidcss : '',
    empname : '',
    column_names : [],
    no_of_rows : 0,

  }
  getExtension=(file)=>{
    // console.log(file)
    const parts = file.name.split('.')
    const extension = parts[parts.length-1]
    // console.log(extension)
    return EXTENSIONS.includes(extension)
    }

  readExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();

     if(file){
      if(this.getExtension(file)){
        this.setState({show : false})
        axios.get('https://run.mocky.io/v3/a818a034-1b9a-4f8a-b0ac-4c8929a9e29d')
      .then(res => {
        // console.log(res.data.page_title)
        // console.log(res.data.column_titles)
        this.setState({column_names : res.data.column_titles})
        this.setState({validations : res.data.validations})
        // console.log(this.state.validations['Employee ID'])
        // console.log(this.state.validations)
        this.setState({empname : res.data.validations['Employee Name']})
        // console.log(this.state.empname)
        this.setState({empname : this.state.empname.toLowerCase()})
        // console.log(this.state.empname)
        this.setState({page_title : res.data.page_title})
      })
        fileReader.readAsArrayBuffer(file);
        }
        else{
          alert("Invalid file input! Select Excel, csv file")
        }
     }
     else{
      //  setItems([])
      this.setstate({items : []})
     }

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;

        const wb = XLSX.read(bufferArray, { type: "buffer" });

        const wsname = wb.SheetNames[0];

        const ws = wb.Sheets[wsname];

        const data = XLSX.utils.sheet_to_json(ws);

        resolve(data);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };



    });

    promise.then((d) => {
      // console.log(d)


      // setItems(d);
      this.setState({items : d})
      axios.get('https://run.mocky.io/v3/a818a034-1b9a-4f8a-b0ac-4c8929a9e29d')
      .then(res => {
        this.setState({no_of_rows : res.data.max_allowed_rows})
        if(this.state.items.length > parseInt(this.state.no_of_rows)){
          this.setState({items: this.state.items.slice(0,parseInt(this.state.no_of_rows))})
        }
      })


      // console.log(this.state.items.length)

      // console.log(this.state.items)
      // this.state.items.map((d) => {
      //   if(typeof(d.EmployeeID) != 'number' ){
      //     this.setState({empidcss : 'employId'})
      //     console.log('incorrect')
      //   }
      //   else{
      //     console.log('correct')
      //   }
      // })
      // console.log(this.state.items)
    });



  };

  checkname(a){
    const temp = this.state.empname
    if(typeof(a) != temp ){
      return false
    }
    else{
      return true
    }

  }

  checkid(id){
    const send = this.state.validations['Employee ID']
    // console.log(typeof(send))
    if(Number.isInteger(id) !== true ){
      // console.log(this.state.validations['Employee ID'])
      return 'other'
    }
    else{
      return send
    }

  }

  render(){


  return (
    <div>


      {this.state.show ?
       <input
       type="file"
       accept=".csv, .xlsx"
       onChange={(e) => {
         const file = e.target.files[0];
         this.readExcel(file);
       }}
     /> :
     <div>
       <h3>{this.state.page_title}</h3>
     <table className="table container table table-bordered">
        <thead>
          <tr>
        {
    this.state.column_names.map((value, index) => {
        return <th key={index}>{value}</th>
    })
}
</tr>
          {/* <tr>
            <th scope="col">EmployeeID</th>
            <th scope="col">EmployeeName</th>
            <th scope="col">Mobile</th>
            <th scope="col">Joining Date</th>
            <th scope="col">Email</th>
            <th scope="col">DOB</th>
            <th scope="col">DepartmentName</th>

          </tr> */}
        </thead>
        <tbody>
          {this.state.items.map((d) => (
            <tr key={d.EmployeeID}>
              {/* {console.log(test)}
              {console.log(typeof(d.EmployeeName))} */}
              <td className={this.checkid(d.EmployeeID) === 'INTEGER'?'' : 'employId'} data-tooltip = "Data type Mismatched(should be an integer)">{d.EmployeeID}</td>
              <td className={this.checkname(d.EmployeeName)?'' : 'employName'} data-tooltip = "Data type Mismatched(should be a string)">{d.EmployeeName}</td>
              <td className={this.checkid(d.Mobile) === 'INTEGER'?'' : 'employMobile'} data-tooltip = "Data type Mismatched(should be an integer)">{d.Mobile}</td>
              <td className="employJoiningDate">{d.JoiningDate}</td>
              <td className={this.checkname(d.Email)?'' : 'employEmail'} data-tooltip = "Data type Mismatched(should be a string)">{d.Email}</td>
              <td className="employDOB">{d.DOB}</td>
              <td className={this.checkname(d.DepartmentName)?'' : 'employDepartmentName'} data-tooltip = "Data type Mismatched(should be a string)">{d.DepartmentName}</td>

            </tr>
          ))}
        </tbody>
      </table>
      </div>
      }





    </div>
  );
          }
}

export default App;



// MOCK API
// {
//   "page_title": "Upload Employee Data from excel.",
//   "max_allowed_rows": "5",
//   "column_titles": [
//     "Employee ID",
//     "Employee Name",
//     "Mobile",
//     "Joining Date",
//     "Email",
//     "DOB",
//     "Department Name"
//   ],
//   "validations": {
//     "Employee ID":"INTEGER",
//     "Employee Name": "STRING",
//     "Mobile": "INTEGER",
//     "Email": "STRING",
//     "Department":"STRING"
//   }
// }