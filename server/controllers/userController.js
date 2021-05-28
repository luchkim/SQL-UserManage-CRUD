// logic of code

const mysql = require('mysql');


const pool = mysql.createPool({
    connectionLimit: 100, // maximum number to create the connection at once to db
    host: 'localhost',
    user: 'root',
    password: 'password',
    database:'usermanagement'
});

// view users
exports.view = (req, res)=>{

    pool.getConnection((err, connection)=>{
        if(err){
            console.log('Connection Error: '+ err);
        }
        console.log('DB Connected with ID..'+connection.threadId);

            // use the connection
        connection.query('SELECT * FROM user WHERE status = "active"', (err, rows)=>{
            // when done with the connection, release it
            connection.release();

            if(!err){
                let removedUser = req.query.removed;

                res.render('home', {rows, removedUser});
            }
            else{
                console.log('Error in Controller Connection: ', err);
            }
            // console.log(rows)
        })
    });
};

// Find user by search in main form nav
exports.find = (req, res)=>{

    pool.getConnection((err, connection)=>{
        if(err){
            console.log('Connection Error: '+ err);
        }
        console.log('DB Connected with ID..'+connection.threadId);

        // value from Form Search in main.hbs nav
        let searchTerm = req.body.search;


            // use the connection, % because in form, we use novalidator. 
        connection.query('SELECT * FROM user WHERE first_name LIKE ? OR last_name LIKE ?', ['%'+searchTerm+'%', '%'+searchTerm+'%'], (err, rows)=>{
            // when done with the connection, release it
            connection.release();

            if(!err){
                res.render('home', {rows});
            }
            else{
                console.log('Error in Controller Connection: ', err);
            }
            // console.log(rows)
        })
    });
}

exports.form = (req, res) => {
    res.render('add-user');
}


// Create and Add User
exports.create = (req, res)=>{

    const { first_name, last_name, email, phone, comments } = req.body;

    pool.getConnection((err, connection) => {
      if (err) throw err; // not connected!
      console.log('Connected as ID ' + connection.threadId);
  
      // User the connection
      connection.query('INSERT INTO user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ?', [first_name, last_name, email, phone, comments], (err, rows) => {
        // When done with the connection, release it
        connection.release();
        if (!err) {
          res.render('add-user', { alert: 'User added successfully.' });
        } else {
          console.log(err);
        }
        console.log('The data from user table: \n', rows);
      });
    });
}

// edit usre
exports.edit = (req, res)=>{
    // res.render('edit-user');

    pool.getConnection((err, connection)=>{
        if(err){
            console.log('Connection Error: '+ err);
        }
        console.log('DB Connected with ID..'+connection.threadId);

            // use the connection
        connection.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err, rows)=>{
            // when done with the connection, release it
            connection.release();

            if(!err){
                res.render('edit-user', {rows});
            }
            else{
                console.log('Error in Controller Connection: ', err);
            }
            // console.log(rows)
        })
    });
}


// Update usre
exports.update = (req, res)=>{
    // res.render('edit-user');
    const {first_name, last_name, email, phone, comments} = req.body;

    pool.getConnection((err, connection)=>{
        if(err){
            console.log('Connection Error: '+ err);
        }
        console.log('DB Connected with ID..'+connection.threadId);

            // use the connection
        connection.query('UPDATE user SET first_name=?, last_name=?, email=?, phone=?, comments=? WHERE id = ?', [first_name, last_name, email, phone, comments, req.params.id], (err, rows)=>{
            // when done with the connection, release it
            connection.release();

            if(!err){

                // go db to get newly updated record
                pool.getConnection((err, connection)=>{
                    if(err){
                        console.log('Connection Error: '+ err);
                    }
                    console.log('DB Connected with ID..'+connection.threadId);
                        // use the connection
                    connection.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err, rows)=>{
                        // when done with the connection, release it
                        connection.release();
            
                        if(!err){
                            res.render('edit-user', {rows, alert: `${first_name} has been updated`}); // render edit user to show edited data
                        }
                        else{
                            console.log('Error in Controller Connection: ', err);
                        }
                        // console.log(rows)
                    });
                });
            }
            else{
                console.log('Error in Controller Connection: ', err);
            }
            // console.log(rows)
        })
    });
}

// Delete from screen or database
exports.delete = (req, res)=>{
    // res.render('edit-user');

    // // DELETE PERMANENTLY
    // pool.getConnection((err, connection)=>{
    //     if(err){
    //         console.log('Connection Error: '+ err);
    //     }
    //     console.log('DB Connected with ID..'+connection.threadId);

    //         // use the connection
    //     connection.query('DELETE FROM user WHERE id = ?', [req.params.id], (err, rows)=>{
    //         // when done with the connection, release it
    //         connection.release();

    //         if(!err){
    //             res.redirect('/');
    //         }
    //         else{
    //             console.log('Error in Controller Connection: ', err);
    //         }
    //         // console.log(rows)
    //     })
    // });

    pool.getConnection((err, connection)=>{
        if(err){
            console.log('Connection Error: '+ err);
        }
        console.log('DB Connected with ID..'+connection.threadId);

            // use the connection
        connection.query('UPDATE  user SET status =? WHERE id = ?', ['removed', req.params.id], (err, rows)=>{
            // when done with the connection, release it
            connection.release();

            if(!err){
                // since it is home, we use speciall
                let removedUser = encodeURIComponent('User successfully removed.');
                res.redirect('/?removed=' + removedUser);   // put on url to grap to display home page
            }
            else{
                console.log('Error in Controller Connection: ', err);
            }
            // console.log(rows)
        })
    });
}

// for View Key
exports.viewall = (req, res)=>{

    pool.getConnection((err, connection)=>{
        if(err){
            console.log('Connection Error: '+ err);
        }
        console.log('DB Connected with ID..'+connection.threadId);

            // use the connection
        connection.query('SELECT * FROM user WHERE id = ?',[req.params.id], (err, rows)=>{
            // when done with the connection, release it
            connection.release();

            if(!err){
                res.render('view-user', {rows});
            }
            else{
                console.log('Error in Controller Connection: ', err);
            }
            // console.log(rows)
        })
    });
};