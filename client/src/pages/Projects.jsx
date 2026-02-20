import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const [newProject, setNewProject] = useState({
        title: '',
        description: '',
        techStack: '',
        githubLink: '',
        liveLink: ''
    });

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await api.get('/projects');
                setProjects(res.data);
            } catch (error) {
                console.error('Error fetching projects:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddProject = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const projectData = {
                ...newProject,
                techStack: newProject.techStack.split(',').map(s => s.trim()),
                owner: user?.id || user?._id
            };
            const res = await api.post('/projects', projectData);
            setProjects([res.data, ...projects]);
            setShowModal(false);
            setNewProject({ title: '', description: '', techStack: '', githubLink: '', liveLink: '' });
            alert('Project saved successfully!');
        } catch (error) {
            console.error('Error adding project:', error);
            alert('Failed to save project: ' + (error.response?.data?.error || error.message));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-8 h-full bg-[#f8fafc] dark:bg-[#0f172a] animate-fade-in overflow-y-auto custom-scrollbar">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">Your Projects</h1>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">Manage and showcase your development portfolio.</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-emerald-500/20 active:scale-95 transition-all text-sm"
                    >
                        + Add Project
                    </button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects.map((project) => (
                            <div key={project._id} className="bg-white dark:bg-[#111827] rounded-[2rem] overflow-hidden border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-xl transition-all group">
                                <div className="h-48 overflow-hidden relative">
                                    <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                    <div className="absolute bottom-4 left-6">
                                        <div className="flex gap-2">
                                            {project.techStack.map((tech, i) => (
                                                <span key={i} className="text-[8px] bg-emerald-500 text-white px-2 py-0.5 rounded font-bold uppercase tracking-widest">{tech}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{project.title}</h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed line-clamp-2 h-8 mb-6">{project.description}</p>
                                    <div className="flex items-center justify-between mt-auto">
                                        <div className="flex gap-4">
                                            {project.githubLink && <a href={project.githubLink} className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">GitHub</a>}
                                            {project.liveLink && <a href={project.liveLink} className="text-emerald-500 font-bold hover:underline">Live Demo</a>}
                                        </div>
                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Added {new Date(project.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add Project Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-[#1a1a1a] w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-white/10">
                        <div className="p-8 border-b border-gray-100 dark:border-white/5">
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">New Project</h2>
                        </div>
                        <form onSubmit={handleAddProject} className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">Project Title</label>
                                    <input
                                        required
                                        value={newProject.title}
                                        onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                                        className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white p-4 rounded-2xl border border-transparent focus:border-emerald-500 transition-all outline-none"
                                        placeholder="Awesome App"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">Tech Stack (comma separated)</label>
                                    <input
                                        value={newProject.techStack}
                                        onChange={(e) => setNewProject({ ...newProject, techStack: e.target.value })}
                                        className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white p-4 rounded-2xl border border-transparent focus:border-emerald-500 transition-all outline-none"
                                        placeholder="React, Node.js, MongoDB"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">Description</label>
                                <textarea
                                    required
                                    value={newProject.description}
                                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                    className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white p-4 rounded-2xl border border-transparent focus:border-emerald-500 transition-all outline-none h-32 resize-none"
                                    placeholder="Tell us about your project..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">GitHub URL</label>
                                    <input
                                        value={newProject.githubLink}
                                        onChange={(e) => setNewProject({ ...newProject, githubLink: e.target.value })}
                                        className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white p-4 rounded-2xl border border-transparent focus:border-emerald-500 transition-all outline-none"
                                        placeholder="github.com/..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">Live Demo URL</label>
                                    <input
                                        value={newProject.liveLink}
                                        onChange={(e) => setNewProject({ ...newProject, liveLink: e.target.value })}
                                        className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white p-4 rounded-2xl border border-transparent focus:border-emerald-500 transition-all outline-none"
                                        placeholder="myapp.com"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-4 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-bold rounded-2xl transition-all border border-transparent hover:bg-gray-200 dark:hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`flex-1 py-4 bg-emerald-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-emerald-600'}`}
                                >
                                    {isSubmitting ? 'Saving...' : 'Save Project'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Projects;
