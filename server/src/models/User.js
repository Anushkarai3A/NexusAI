import bcrypt from 'bcryptjs';
import { pool, asApi } from '../db.js';
export default class User {
 constructor(data={}) { Object.assign(this,data); }
 async save() { const hash = await bcrypt.hash(this.password,10); const r=await pool.query('INSERT INTO users(username,email,password,role,resume_url) VALUES($1,$2,$3,$4,$5) RETURNING *',[this.username,this.email,hash,this.role||'candidate',this.resume_url||null]); Object.assign(this,asApi(r.rows[0])); return this; }
 async comparePassword(p) { return bcrypt.compare(p,this.password); }
 static async findOne(q={}) { const key=q.email?'email':q.username?'username':null; if(!key)return null; const r=await pool.query(`SELECT * FROM users WHERE ${key}=$1 LIMIT 1`,[q[key]]); if(!r.rowCount)return null; const u=asApi(r.rows[0]); const instance=new User(u); instance._id=u.id; return instance; }
}
