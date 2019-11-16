var connection = require("../config/config")
const bodyParser = require('body-parser');
let jwt = require('jsonwebtoken');
let config = require('../config/config');
let middleware = require('../middleware/middleware');
let config1 = require("../config/config1")



exports.addUser = function (req, res) {
    // console.log("req",req.body);
    var today = new Date();
    var users = {
        "empFirstName": req.body.empFirstName,
        "middle_name": req.body.middle_name,
        "empLastName": req.body.empLastName,
        "gender ": req.body.gender,
        "martial_status": req.body.martial_status,
        "empemail ": req.body.empemail,
        "password": req.body.password,
        "mobile_no ": req.body.mobile_no,
        "dob ": req.body.dob,
        "doj": req.body.doj,
        "created_date": today,
         
    }

    console.log('req.user', req.user)
 if(req.user.is_admin==1){
    connection.query(`SELECT * FROM employee WHERE empemail =?`, [req.body.empemail], function (error, results, fields) {
   
        if (error) {
            // console.log("error ocurred",error);
            res.send({
                "code": 400,
                "failed": "error ocurred",
                "error": error
            })
        } else {

            if (results.length > 0) {

                res.send({
                    "code": 203,
                    "message": "Email already exists"
                });
            } else {

                connection.query('INSERT INTO employee SET ?', users, function (error, results, fields) {
                    if (error) {
                        console.log("error ocurred", error);
                        res.send({
                            "code": 400,
                            "message": "error ocurred",
                            "err": error
                        })
                    } else {
                        console.log('The solution is: ', results);
                        res.send({
                            "code": 200,
                            "message": "user registered sucessfully",
                            "data": results
                        });
                    }
                    
               
                });
            }


        }
    })
}else{
    res.json({
        "code":202,
        "message":"Action only allowed by admin",
        "data":null
    })
}
}





exports.login = function (req, res, next) {
    var empemail = req.body.empemail;
    var password = req.body.password;

    // For the given username fetch user from DB



    console.log(empemail);
    console.log(password);

    connection.query("SELECT * FROM employee WHERE empemail = ?", [empemail], function (error, results, fields) {

        if (error) {
            // console.log("error ocurred",error);
            res.send({
                "code": 400,
                "message": "error ocurred"
            })
        } else {
            console.log('The solution is: ', results);
            if (results.length > 0) {
                if (results[0].password == password) {
                    console.log('emp id',results[0].empID)
                    let payload = {
            
                        'password': password,
                        'empemail': empemail,
                        'is_admin': results[0].is_admin,
                        'empID':results[0].empID
                    }
                    console.log(payload, "Payload")
                    let token = jwt.sign(payload,
                        config1.secret,
                        {
                            expiresIn: '24h' // expires in 24 hours
                        }
                    );
                    console.log(token);
                    res.send({
                        "code": 200,
                        "message": "login sucessfull",
                        'data': results[0],
                        'token': token,
                    });
                }
                else {
                    res.send({
                        "code": 204,
                        "success": "Password does not match"
                    });
                }
            }
            else {
                res.send({
                    "code": 204,
                    "success": "Email does not exists"
                });
            }

        }
    })
}




// exports.register = function (req, res) {
//     // console.log("req",req.body);
//     var today = new Date();
//     var users = {
//         "empFirstName": req.body.empFirstName,
//         "middle_name": req.body.middle_name,
//         "empLastName": req.body.empLastName,
//         "gender ":      req.body.gender,
//         "martial_status":req.body.martial_status , 
//         "empemail ": req.body.empemail,
//         "password":req.body.password,
//         "mobile_no ":req.body.mobile_no,
//         "dob ":       req.body.dob,
//         "doj" :       req.body.doj,
//         "created_date": today,
//         "is_admin":req.body.is_admin
//         }


//     connection.query(`SELECT * FROM employee WHERE  empemail ='${req.body.empemail}' AND is_admin = 0` , function (error, results, fields) {
//           console.log(results[0].is_admin)
//         if (error) {
//             // console.log("error ocurred",error);
//             res.send({
//                 "code": 400,
//                 "failed": "error ocurred",
//                 "error":error
//             })
//         } else {

//             if (results.length > 0) {

//                 res.send({
//                     "code": 203,
//                     "message": "Email already exists"
//                 });
//             } else {

//                 connection.query('INSERT INTO employee SET ?', users, function (error, results, fields) {
//                     if (error) {
//                         console.log("error ocurred", error);
//                         res.send({
//                             "code": 400,
//                             "message": "error ocurred",
//                              "err": error
//                         })
//                     } else {
//                         console.log('The solution is: ', results);
//                         res.send({
//                             "code": 200,
//                             "message": "user registered sucessfully",
//                             "data": results
//                         });
//                     }
//                 });
//             }


//         }
//     })
// }


exports.insert=function(req,res){
    let date = new Date();
let obj={
    "employee_id":req.body.employee_id,
    "company_name":req.body.company_name,
    "experience_from":req.body.experience_from,
    "experience_to":req.body.experience_to,
    "experience_technology":JSON.stringify(req.body.experience_technology),
    "description":req.body.description,
    "created_date":date,
    "modified_date":date
}
   
  connection.query('INSERT INTO employee_experience SET ?',obj,function(error,results){
          
  if (error) {
    console.log("error ocurred", error);
    res.send({
        "code": 400,
        "message": "error ocurred",
        "err": error
    })
} else {

    console.log('The solution is: ', results);
    res.send({
        "code": 200,
        "message": "user registered sucessfully",
        "data": results
    });
}

  
})
}


