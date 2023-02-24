import React, { Fragment } from "react";
function registraionForm()
{
    return(
        <React.Fragment>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <h5 className="mt-2">Add new User/ Vehicle</h5>
                        <form>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label className="form-lable">Name</label>
                                        <input type="text" name="email" className="form-control" placeholder="Enter the User Name"/>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label className="form-lable">User Hash Address</label>
                                        <input type="text" name="email" className="form-control" placeholder="Enter Hash address"/>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label className="form-lable">RFID</label>
                                        <input type="text" name="phone" className="form-control" placeholder="Enter Rfid"/>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label className="form-lable">Vehicle Number</label>
                                        <input type="text" name="address" className="form-control" placeholder="Enter Vehicle Number"/>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label className="form-lable">Type of Vehicle</label>
                                            <select className="form-control">
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
                                        <input type="text" name="email" className="form-control" placeholder="Enter the allowed weight of vehicle"/>
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
export default registraionForm;