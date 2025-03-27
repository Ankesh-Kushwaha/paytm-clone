const zod = require('zod');

const zodUserSchemaSignUp = zod.object({
  userName: zod.string().min(3).max(30),
  firstName: zod.string().min(3).max(50),
  lastName: zod.string().min(3).max(50),
  email: zod.string().email(),
  password: zod.string().min(6),
})

const zodUserSchemaSignIn = zod.object({
  email: zod.string().email(),
  password: zod.string().min(6),
})

const zodSchemaUpdate = zod.object({
  userName: zod.string().min(3).max(30).optional(),
  firstName: zod.string().min(3).max(50).optional(),
  lastName: zod.string().min(3).max(50).optional(),
  password: zod.string().min(6).optional(),
  email:zod.string().email().optional(),
})


module.exports = {
  zodUserSchemaSignUp,
  zodUserSchemaSignIn,
  zodSchemaUpdate
}