const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const opts = { toJSON: { virtuals: true } }

const imageSchema = new Schema({
    path: {
        type: String,
        trim: true
    },
    filename: {
        type: String,
        trim: true
    }

},{
  timestamps: true
}, opts)

imageSchema.virtual('thumbnail').get(function(){
  return this.path.replace('/upload', '/upload/w_200');
});

imageSchema.virtual('rounded').get(function(){
  return this.path.replace('/upload', '/upload/w_150,h_150,c_fill,g_face,r_max');
}, opts);

const addressSchema = new Schema({
    name: {
      type: String,
      trim: true,
      required: true
    },
    phoneNumber: {
      type: String,
      trim: true,
      required: true,
    },
    address: {
      type: String,
      trim: true,
      required: true
    },
    city: {
      type: String,
      trim: true,
      required: true
    },
    state: {
      type: String,
      trim: true,
      required: true
    },
    pincode: {
      type: String,
      trim: true,
      required: true
    }
}, {
  timestamps: true
});

const userSchema = new Schema({
  firstName: {
    type: String,
    required: [true, "Please add first name"],
    trim: true
  },
  lastName: {
      type: String,
      required: [true, "Please add last name"],
      trim: true
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
    trim: true,
    lowercase: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  phoneNumber:{
    type: String,
    required: [true, "Please add the phone number"],
    unique: true,
    trim: true
  },
  address: {
    billingAddress: addressSchema,
    shippingAddress: addressSchema,
  },
  password: {
    type: String,
    required: [true, "Please add the password"],
    trim: true
  },
  dob: {
    type: String,
    required: [true, "Please add the date of birth."]
  },
  avatar: imageSchema,
  role: {
    type: String,
    default: 'ROLE_MEMBER',
    enum: ['ROLE_USER', 'ROLE_ADMIN', 'ROLE_SELLER']
  },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref : "Product"
    }
  ],
  bids: [
    {
      type: Schema.Types.ObjectId,
      ref : "Bid"
    }
  ],
  bidsWon: [
    {
      type: Schema.Types.ObjectId,
      ref : "Bid"
    }
  ],
  otp: {
    type: String,
    trim: true
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
},
{
  timestamps: true
})

/**
 * PRE
 * These funcitons will execute everytime "BEFORE" a document is saved in users collection
 * 
 * @param {string} -  mongoose command
 * @param {function} - middleware anonymous function
 * @returns {funciton} - next method stating return to the call stack
 * 
 * 
*/

/**
 * Before saving hash and salt the password if it has been modified.
 */
userSchema.pre("save", async function (next) {
  try {
      if(this.isModified("password")){
          const hash = await bcrypt.hash(this.password, 8);
          this.password = hash;
      }
      if(this.isModified("otp")){
        const otpHash = await bcrypt.hash(this.otp, 8);
        this.otp = otpHash;
      }

      next();
  } catch (err) {
      next(err);
  }
});

// Virtual properties.
/**
 * @description - Virtuals are a way to create properties that are not stored 
 *                in the database, but are computed from other properties.
 *                 
 *              - This virtual property returns all the tasks that are associated with
 *                the current user.
 */
userSchema.virtual("transactions", {
  ref: "Transaction",
  localField: "_id",
  foreignField: "bidder"
});

userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

/**
* This function is attached to UserSchema, i.e. Every document would have access to this funciton, where
* it can validate the password hash using becrypt
* 
* @param {string}  user password
* @returns {Promise} - If does not match, returns rejecton and if matched, resolves the value
*/

/**
 * Compare the hashed password with the password provided.
 */
userSchema.methods.checkPassword = function (password) {
  const passwordHash = this.password;
  return new Promise((resolve, reject) => {
      bcrypt.compare(password, passwordHash, (err, same) => {
      if (err) {
          return reject(err);
      }
      resolve(same);
      });
  });
};

userSchema.methods.checkOTP = function (otp) {
  const otpHash = this.otp;
  return new Promise((resolve, reject) => {
      bcrypt.compare(otp, otpHash, (err, same) => {
      if (err) {
          return reject(err);
      }
      resolve(same);
      });
  });
}

const User = mongoose.model('User', userSchema)

module.exports = User;