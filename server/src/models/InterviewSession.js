import { pool, asApi } from '../db.js';
export default class InterviewSession {
 constructor(d={}){Object.assign(this,d);}
 async save(){const r=await pool.query('INSERT INTO interview_sessions(candidate_id,problem_id,code,status,score,ai_feedback,video_url,feedback_items) VALUES($1,$2,$3,$4,$5::jsonb,$6,$7,$8::jsonb) RETURNING *',[this.candidate,this.problem,this.code,this.status||'Pending',JSON.stringify(this.score||{}),this.aiFeedback||null,this.videoUrl||null,JSON.stringify(this.feedbackItems||[])]);Object.assign(this,asApi(r.rows[0]));return this;}
 static async find(){const r=await pool.query(`SELECT s.*, row_to_json(u.*) AS candidate_data, row_to_json(p.*) AS problem_data FROM interview_sessions s LEFT JOIN users u ON u.id=s.candidate_id LEFT JOIN problems p ON p.id=s.problem_id ORDER BY s.created_at DESC`);return r.rows.map(x=>{const o=asApi(x);o.candidate=x.candidate_data?{_id:x.candidate_data.id,id:x.candidate_data.id,username:x.candidate_data.username,email:x.candidate_data.email}:null;o.problem=x.problem_data?{_id:x.problem_data.id,id:x.problem_data.id,title:x.problem_data.title}:null;delete o.candidate_data;delete o.problem_data;return o;});}
 static async findByIdAndUpdate(id, update){const r=await pool.query('UPDATE interview_sessions SET status=$2,updated_at=NOW() WHERE id=$1 RETURNING *',[id,update.status]);return r.rowCount?asApi(r.rows[0]):null;}
}
