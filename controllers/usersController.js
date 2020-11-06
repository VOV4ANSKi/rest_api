const { validationResult } = require("express-validator"),
  passport = require("passport"),
  jwt = require("jsonwebtoken"),
  User = require("../models/user.js"),
  httpStatus = require("http-status-codes"),
  errorController = require("./errorController");

module.exports = {

  validate: (req, res, next) => {
  
    let errors = validationResult(req);
    
    if (!errors.isEmpty()) {
    
      errors = errors.array().map(e => e.msg);
      res.status(httpStatus.BAD_REQUEST)
        .json({ error: true, message: errors.join(" and ") });
    
    } else {
    
      return next();
    
    }
  
  },

  create: (req, res) => {
  
    User.register({ id: req.body.id }, req.body.password, (error, user) => {
    
      if (error) {
      
        console.error(`Error while signing up user: ${error}`);
        res.json({error: true, message: error.message});
      
      } else {
      
        res.json({error: false, message: "User has been created succesfully!"});
      
      }
    
    })
     
  },
  
  authenticate: (req, res, next) => {
  
    passport.authenticate("local", (errors, user) => {
    
      if (errors || !user) {
      
        res.json({error: true, message: "Could not authenticate a user :("});
      
      } else {
      
        let token = jwt.sign({ id: user.id }, "sc15243", {expiresIn: "10m"});
        let refresh = jwt.sign({ id: user.id, hash: user.hash.slice(0, 11) }, "sc34251", {expiresIn: "1d"});
        
        req.login(user, async error => {
        
          if (error) {
          
            console.error(error);
            res.json({ error: true, message: error.message });
          
          } else {
          
            await User.update({refreshAvailabale: true}, { where: { id: user.id }  });
          
            return res.json({ error: false, token , refresh});
          
          }
        
        });
        
      }
    
    })(req, res, next);
  
  },
  
  logout: async (req, res) => {
    
    if (!req.isAuthenticated()) {
    
      errorController.pageNotFoundError(req, res);
    
    } else {
    
      await User.update({refreshAvailabale: false}, { where: { id: req.user.id } });    
      req.logout();
      res.json({ error: false, message: "You have been successfully logout!" });
    
    }
  
  },
  
  verify: (req, res, next) => {
  
    if (!req.headers.token) {
    
      res.status(httpStatus.UNAUTHORIZED)
        .json({ error: true, message: "You did not prvide a token in headers" });
    
    } else {
    
      jwt.verify(
      
        req.headers.token,
        
        "sc15243",
        
        (error, payload) => {
        
          if (error) {
          
            res.status(httpStatus.UNAUTHORIZED)
              .json({ error: true, message: error.message });
          
          } else {
          
            User.findOne({ id: payload.id })
            
              .then(user => {
              
                if (!user) {
                
                  res.status(httpStatus.FORBIDDEN)
                    .json({ error: true, message: "there is no user which could match that token :(" });
                
                } else {
                
                  return next();
                
                }
              
              })
          
          }
        
        }
      
      );
    
    }
  
  },
  
  info: (req, res) => {
  
    if (!req.isAuthenticated()) {
    
      return errorController.pageNotFoundError(req, res);
    
    } else {
    
      res.json({ error: false, id: req.user.id });
    
    }
  
  },
  
  refresh: (req, res) => {
  
    if (!req.query.token) {
    
      res.status(httpStatus.UNAUTHORIZED)
        .json({ error: true, message: "You did not provide a token in query string :(" });
    
    } else {
    
      jwt.verify(
      
        req.query.token,
        
        "sc34251",
        
        (error, payload) => {
        
          if (error) {
          
            res.status(httpStatus.UNAUTHORIZED)
              .json({ error: true, message: error.message });
          
          } else {
          
            User.findOne({ id: payload.id })
            
              .then(user => {
              
                if (!user || !user.refreshAvailabale) {
                
                  res.status(httpStatus.FORBIDDEN)
                    .json({ error: true, message: "there is no user which could match that token or user is out :(" });
                
                } else {
                
                  let token = jwt.sign({ id: user.id }, "sc15243", {expiresIn: "10m"});
                  let refresh = jwt.sign({ id: user.id }, "sc34251", {expiresIn: "1d"});
                  res.json({ error: false, token, refresh });
                
                }
              
              })
          
          }
        
        }
      
      );
    
    }
    
  }

}

















