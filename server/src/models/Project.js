import { pool, asApi } from '../db.js';
class FindQuery { constructor(){this.order='created_at DESC';} sort(spec={}) { this.order=spec.createdAt===1?'created_at ASC':'created_at DESC'; return this; } then(resolve,reject){ return pool.query(`SELECT * FROM projects ORDER BY ${this.order}`).then(r=>resolve(r.rows.map(asApi)),reject); } }
export default class Project {
 constructor(d={}) { Object.assign(this,d); }
 static find(){return new FindQuery();}
 async save(){const r=await pool.query('INSERT INTO projects(title,description,tech_stack,github_link,live_link,owner_id,image) VALUES($1,$2,$3::jsonb,$4,$5,$6,$7) RETURNING *',[this.title,this.description,JSON.stringify(this.techStack||[]),this.githubLink||null,this.liveLink||null,this.owner||this.owner_id||null,this.image||null]);Object.assign(this,asApi(r.rows[0]));return this;}
 static async findByIdAndDelete(id){return pool.query('DELETE FROM projects WHERE id=$1',[id]);}
}
