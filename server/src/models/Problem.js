import { pool, asApi } from '../db.js';
const api = r => r.rows.map(x=>asApi(x));
export default class Problem {
 constructor(data={}) { Object.assign(this,data); }
 async save() { const r=await pool.query('INSERT INTO problems(title,description,category,difficulty,test_cases,starter_code) VALUES($1,$2,$3,$4,$5::jsonb,$6) RETURNING *',[this.title,this.description,this.category||'General',this.difficulty||'Medium',JSON.stringify(this.testCases||[]),this.starterCode||'// Write your code here']); Object.assign(this,asApi(r.rows[0])); return this; }
 static async find(q={}) { const r=await pool.query('SELECT * FROM problems ORDER BY created_at DESC'); return api(r); }
 static async findById(id) { const r=await pool.query('SELECT * FROM problems WHERE id=$1',[id]); return r.rowCount?asApi(r.rows[0]):null; }
 static async deleteMany() { return pool.query('DELETE FROM problems'); }
 static async insertMany(items) { const out=[]; for(const x of items){const p=new Problem(x);out.push(await p.save());} return out; }
}
