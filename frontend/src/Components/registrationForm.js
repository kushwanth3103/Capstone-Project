import React, { useState } from "react";
//import { useNavigate } from "react-router-dom";
function RegistrationForm()
{
    const [formValue, setFormValue]= useState({uName:'', userAdd:'',rfid:'',vehicleNum:''});
    const [message, setMessage]= useState();
    //const navigate= useNavigate();
    const handleInput=(e)=>{
        const {name, value}= e.target;
        setFormValue({...formValue, [name]:value});
    }
    const handleSubmit= async(e)=>{
       e.preventDefault();
       const allInputvalue= { uName: formValue.uName, userAdd:formValue.userAdd, rfid:formValue.rfid, vehicleNum:formValue.vehicleNum}; 
       console.log(allInputvalue);
      let res= await fetch("http://localhost:3000/userReg",{
        method:"POST",
        headers:{'content-type':'application/json'},
        body:JSON.stringify(allInputvalue)
      });
      let resjson= await res.json();
      if(res.status===200)
      {
        console.log(allInputvalue);
        setMessage(resjson.success);
        setTimeout(()=>{
           console.log("just fun");
        }, 2000);

      } else{
        console.log(allInputvalue);
        setMessage("Some Error Occured");
      }
    }
    return(
        <React.Fragment>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <h5 className="mt-2">Add new User/ Vehicle</h5>
                        <p className="text-success"> { message } </p>
                        <form onSubmit={ handleSubmit}>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label className="form-lable">Name</label>
                                        <input type="text" name="uName" className="form-control" placeholder="Enter the User Name" value={formValue.uName} onChange={ handleInput}/>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label className="form-lable">User Hash Address</label>
                                        <input type="text" name="userAdd" className="form-control" placeholder="Enter Hash address" value={formValue.userAdd} onChange={ handleInput}/>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label className="form-lable">RFID</label>
                                        <input type="text" name="rfid" className="form-control" placeholder="Enter Rfid" value={formValue.rfid} onChange={ handleInput}/>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label className="form-lable">Vehicle Number</label>
                                        <input type="text" name="vehicleNum" className="form-control" placeholder="Enter Vehicle Number" value={formValue.vehicleNum} onChange={ handleInput}/>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label className="form-lable">Type of Vehicle</label>
                                            <select className="form-control" name="vehicletype" onChange={ handleInput}>
                                                <option value="">--Please Select--</option>
                                                <option value="1">Car</option>
                                                <option value="0">Auto</option>
                                                <option value="0">Truck</option>
                                            </select>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label className="form-lable">Vehicle allowed weight</label>
                                        <input type="text" name="weight" className="form-control" placeholder="Enter the allowed weight of vehicle" onChange={ handleInput}/>
                                    </div>
                                </div>

                            <div className="col-md-12">
                                <div className="mb-3" align='center'>
                                    <label className="form-lable"></label>
                                    <button type="submit" className="btn btn-success btn-lg">Submit</button>
                                </div>
                            </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </React.Fragment>

    );
}
export default RegistrationForm;