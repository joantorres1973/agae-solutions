'use client';

import React, { useState } from 'react';
import {
  X,
  Video,
  Plus,
  Trash2,
  CheckCircle2,
  HelpCircle,
  Clock,
  Award,
  Sparkles,
  Play,
  Film,
  BookOpen
} from 'lucide-react';
import { VirtualCourse, VirtualCourseCategory, QuizQuestion } from '@/types/training';

interface NewVirtualCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (courseData: Omit<VirtualCourse, 'id' | 'code' | 'version' | 'publicEnrollmentUrlToken'>) => void;
}

const CATEGORIES: { value: VirtualCourseCategory; label: string; defaultThumb: string }[] = [
  {
    value: 'RIESGO_BIOMECANICO',
    label: 'Riesgo Biomecánico & Ergonomía',
    defaultThumb: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80'
  },
  {
    value: 'SEGURIDAD_VIAL_PESV',
    label: 'Seguridad Vial & Manejo Defensivo (PESV)',
    defaultThumb: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&auto=format&fit=crop&q=80'
  },
  {
    value: 'EMERGENCIAS_EXTINTORES',
    label: 'Control de Incendios & Extintores',
    defaultThumb: 'https://images.unsplash.com/photo-1542385151-efd9000785a0?w=800&auto=format&fit=crop&q=80'
  },
  {
    value: 'RIESGO_PSICOSOCIAL',
    label: 'Sana Convivencia & Riesgo Psicosocial (Res. 3461)',
    defaultThumb: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80'
  },
  {
    value: 'TRABAJO_ALTURAS',
    label: 'Trabajo Seguro en Alturas (Res. 4272/21)',
    defaultThumb: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80'
  },
  {
    value: 'RIESGO_MECANICO',
    label: 'Riesgo Mecánico & Uso de Herramientas',
    defaultThumb: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80'
  },
  {
    value: 'RIESGO_QUIMICO',
    label: 'Riesgo Químico & Sistema Globalmente Armonizado (SGA)',
    defaultThumb: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80'
  },
  {
    value: 'EPP_TRABAJO_SEGURO',
    label: 'Elementos de Protección Personal (EPP)',
    defaultThumb: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=800&auto=format&fit=crop&q=80'
  },
  {
    value: 'INDUCCION_GENERAL',
    label: 'Inducción General en SG-SST (Dec. 1072)',
    defaultThumb: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80'
  }
];

export const NewVirtualCourseModal: React.FC<NewVirtualCourseModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [activeStep, setActiveStep] = useState<'INFO' | 'VIDEO' | 'QUESTIONS'>('INFO');

  // Form State: Course Information
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [objective, setObjective] = useState('');
  const [category, setCategory] = useState<VirtualCourseCategory>('RIESGO_BIOMECANICO');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [targetAudience, setTargetAudience] = useState('Todos los trabajadores de la organización');
  const [minPassingPercentage, setMinPassingPercentage] = useState(80);
  const [facilitatorName, setFacilitatorName] = useState('Especialista en SG-SST (AGAE)');
  const [facilitatorTitle, setFacilitatorTitle] = useState('Especialista en Seguridad y Salud en el Trabajo');

  // Form State: Video
  const [videoUrl, setVideoUrl] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
  const [videoThumbnailUrl, setVideoThumbnailUrl] = useState(CATEGORIES[0].defaultThumb);
  const [videoDurationSeconds, setVideoDurationSeconds] = useState(300);
  const [minWatchPercentageRequired, setMinWatchPercentageRequired] = useState(80);
  const [previewPlaying, setPreviewPlaying] = useState(false);

  // Form State: Questions
  const [questions, setQuestions] = useState<QuizQuestion[]>([
    {
      id: 'q-1',
      question: '¿Cuál es la primera medida de prevención ante este factor de riesgo?',
      type: 'SINGLE_CHOICE',
      options: [
        'Eliminación o sustitución del peligro en la fuente',
        'Uso exclusivo de elementos de protección personal',
        'Ignorar el riesgo hasta que ocurra un accidente',
        'Delegar la responsabilidad al contratista'
      ],
      correctAnswerIndex: 0,
      explanation: 'Conforme a la jerarquía de controles (Dec. 1072/15), la intervención en la fuente (eliminación/sustitución) es siempre la prioridad técnica.'
    },
    {
      id: 'q-2',
      question: '¿A quién debe reportar el trabajador cualquier condición insegura o incidente laboral?',
      type: 'SINGLE_CHOICE',
      options: [
        'A su jefe inmediato o al responsable del SG-SST de la empresa',
        'Únicamente a los compañeros de turno en el almuerzo',
        'A ninguna persona',
        'Solamente cuando finalice el año fiscal'
      ],
      correctAnswerIndex: 0,
      explanation: 'El reporte oportuno de condiciones inseguras e incidentes es una obligación legal del trabajador según el Art. 2.2.4.6.10 del Dec. 1072.'
    }
  ]);

  if (!isOpen) return null;

  // Handle Category Change
  const handleCategoryChange = (cat: VirtualCourseCategory) => {
    setCategory(cat);
    const found = CATEGORIES.find(c => c.value === cat);
    if (found) {
      setVideoThumbnailUrl(found.defaultThumb);
    }
  };

  // Convert YouTube / Vimeo URL to Embed URL
  const getEmbedVideoUrl = (url: string) => {
    if (!url) return '';
    // YouTube watch or short URL
    if (url.includes('youtube.com/watch') || url.includes('youtu.be/')) {
      const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
      if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}?autoplay=1`;
      }
    }
    // Vimeo URL
    if (url.includes('vimeo.com/')) {
      const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
      if (vimeoMatch && vimeoMatch[1]) {
        return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
      }
    }
    return url;
  };

  // Questions Management
  const handleAddQuestion = () => {
    const newQ: QuizQuestion = {
      id: `q-${Date.now()}`,
      question: '',
      type: 'SINGLE_CHOICE',
      options: ['', '', '', ''],
      correctAnswerIndex: 0,
      explanation: ''
    };
    setQuestions(prev => [...prev, newQ]);
  };

  const handleRemoveQuestion = (index: number) => {
    if (questions.length <= 1) return;
    setQuestions(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdateQuestion = (index: number, field: keyof QuizQuestion, value: any) => {
    setQuestions(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleUpdateOption = (qIndex: number, optIndex: number, text: string) => {
    setQuestions(prev => {
      const copy = [...prev];
      const newOpts = [...copy[qIndex].options];
      newOpts[optIndex] = text;
      copy[qIndex] = { ...copy[qIndex], options: newOpts };
      return copy;
    });
  };

  // Validation & Save
  const handleSave = () => {
    if (!title.trim()) {
      alert('Por favor ingrese el título del curso.');
      setActiveStep('INFO');
      return;
    }
    if (!videoUrl.trim()) {
      alert('Por favor ingrese o seleccione la URL del video de la capacitación.');
      setActiveStep('VIDEO');
      return;
    }
    const hasEmptyQuestions = questions.some(q => !q.question.trim() || q.options.some(opt => !opt.trim()));
    if (hasEmptyQuestions) {
      alert('Por favor complete el texto de todas las preguntas y sus 4 opciones de respuesta.');
      setActiveStep('QUESTIONS');
      return;
    }

    onSave({
      title,
      description: description || `Capacitación interactiva sobre ${title} para los trabajadores de la organización.`,
      objective: objective || `Fortalecer conocimientos y conductas seguras en relación con ${title}.`,
      category,
      durationMinutes,
      targetAudience,
      videoUrl,
      videoThumbnailUrl,
      videoDurationSeconds,
      minWatchPercentageRequired,
      questionsCount: questions.length,
      minPassingPercentage,
      maxAttempts: 3,
      validityMonths: 12,
      isPublished: true,
      questions,
      facilitatorName,
      facilitatorTitle
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-4">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-white/20 text-white shrink-0">
              <Video className="w-5 h-5" />
            </span>
            <div>
              <span className="text-[10px] font-bold text-indigo-200 tracking-wider uppercase block">
                Aula Virtual AGAE SOLUTIONS • Gestor de Cursos
              </span>
              <h2 className="text-base font-black tracking-tight">
                Crear Nuevo Curso Virtual Interactivo
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold shrink-0">
          <button
            onClick={() => setActiveStep('INFO')}
            className={`flex-1 py-3 px-4 border-b-2 transition-all flex items-center justify-center gap-2 ${
              activeStep === 'INFO'
                ? 'border-indigo-600 text-indigo-700 bg-white shadow-sm'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center text-[11px]">1</span>
            <span>Información Básica</span>
          </button>

          <button
            onClick={() => setActiveStep('VIDEO')}
            className={`flex-1 py-3 px-4 border-b-2 transition-all flex items-center justify-center gap-2 ${
              activeStep === 'VIDEO'
                ? 'border-indigo-600 text-indigo-700 bg-white shadow-sm'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center text-[11px]">2</span>
            <span>Video & Multimedia</span>
          </button>

          <button
            onClick={() => setActiveStep('QUESTIONS')}
            className={`flex-1 py-3 px-4 border-b-2 transition-all flex items-center justify-center gap-2 ${
              activeStep === 'QUESTIONS'
                ? 'border-indigo-600 text-indigo-700 bg-white shadow-sm'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center text-[11px]">3</span>
            <span>Evaluación ({questions.length} preg.)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* STEP 1: INFORMACIÓN BÁSICA */}
          {activeStep === 'INFO' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Título de la Capacitación *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Prevención del Riesgo Mecánico y Uso Seguro de Herramientas"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    Categoría Temática HSEQ *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => handleCategoryChange(e.target.value as VirtualCourseCategory)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-600 bg-white"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    Duración Estimada (Minutos)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={15}
                      max={480}
                      step={15}
                      value={durationMinutes}
                      onChange={(e) => setDurationMinutes(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-indigo-600"
                    />
                    <span className="text-xs text-slate-500 font-semibold shrink-0">
                      = {(durationMinutes / 60).toFixed(1)} Horas
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Público Objetivo / Población Trabajadora
                </label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="Ej: Conductores, personal operativo, líderes de brigada, todos los trabajadores"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Descripción Pedagógica del Curso
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Resumen del contenido que aprenderá el trabajador durante la sesión multimedia..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-indigo-600 leading-relaxed"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Objetivo de Aprendizaje
                </label>
                <textarea
                  rows={2}
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  placeholder="Establecer los lineamientos y conductas seguras que debe aplicar el colaborador..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-indigo-600 leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    Facilitador / Instructor SST
                  </label>
                  <input
                    type="text"
                    value={facilitatorName}
                    onChange={(e) => setFacilitatorName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    Porcentaje Mínimo de Aprobación
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={50}
                      max={100}
                      step={5}
                      value={minPassingPercentage}
                      onChange={(e) => setMinPassingPercentage(Number(e.target.value))}
                      className="w-24 px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-indigo-600"
                    />
                    <span className="text-xs text-slate-500">% (Recomendado: 80%)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: VIDEO & MULTIMEDIA */}
          {activeStep === 'VIDEO' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-950 flex items-start gap-2.5">
                <Video className="w-5 h-5 text-indigo-700 shrink-0 mt-0.5" />
                <div>
                  <strong>Soporte Universal de Video Multimedia:</strong>
                  <p className="text-[11px] text-indigo-800 mt-0.5">
                    Puede ingresar un enlace de <strong>YouTube</strong> (ej: <code>https://www.youtube.com/watch?v=...</code>), <strong>Vimeo</strong>, o un archivo directo <strong>MP4</strong> alojado en Google Drive, servidor o almacenamiento en la nube.
                  </p>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  URL del Video de Capacitación *
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    required
                    placeholder="https://www.youtube.com/watch?v=... o archivo .mp4"
                    value={videoUrl}
                    onChange={(e) => {
                      setVideoUrl(e.target.value);
                      setPreviewPlaying(false);
                    }}
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                  <button
                    type="button"
                    onClick={() => setPreviewPlaying(!previewPlaying)}
                    className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>{previewPlaying ? 'Pausar' : 'Probar'}</span>
                  </button>
                </div>
              </div>

              {/* Video Player Preview */}
              <div className="rounded-2xl border-2 border-slate-300 bg-slate-950 overflow-hidden shadow-inner aspect-video relative flex items-center justify-center">
                {videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be') || videoUrl.includes('vimeo.com') ? (
                  <iframe
                    src={getEmbedVideoUrl(videoUrl)}
                    title="Previsualización de Video"
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : videoUrl.endsWith('.mp4') || videoUrl.includes('commondatastorage') ? (
                  <video
                    controls
                    className="w-full h-full object-contain"
                    src={videoUrl}
                    poster={videoThumbnailUrl}
                  >
                    Tu navegador no soporta reproducción de video HTML5.
                  </video>
                ) : (
                  <div className="text-center p-6 text-white space-y-2">
                    <Film className="w-10 h-10 mx-auto text-indigo-400 opacity-60" />
                    <p className="text-xs font-bold">Previsualización del Reproductor de Video</p>
                    <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                      Ingrese una URL válida de YouTube, Vimeo o MP4 para visualizar el video interactivo que verán los colaboradores.
                    </p>
                  </div>
                )}
              </div>

              {/* Botones de Videos Demo Sugeridos para Pruebas Rápidas */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-600 block">
                  O seleccione un video de demostración preconfigurado:
                </span>
                <div className="flex flex-wrap gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setVideoUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
                      setPreviewPlaying(true);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] border border-slate-200"
                  >
                    Extintores & Fuego (MP4)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setVideoUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4');
                      setPreviewPlaying(true);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] border border-slate-200"
                  >
                    Seguridad Vial & PESV (MP4)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setVideoUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
                      setPreviewPlaying(true);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] border border-slate-200"
                  >
                    Biomecánico & Ergonomía (MP4)
                  </button>
                </div>
              </div>

              {/* Imagen de Portada / Thumbnail */}
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  URL Imagen de Portada (Miniatura)
                </label>
                <input
                  type="url"
                  value={videoThumbnailUrl}
                  onChange={(e) => setVideoThumbnailUrl(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-700 focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>
          )}

          {/* STEP 3: PREGUNTAS DE EVALUACIÓN */}
          {activeStep === 'QUESTIONS' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Preguntas de Evaluación de Conocimientos ({questions.length})
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Defina las preguntas que responderá el trabajador al finalizar la visualización del video.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1 shadow-sm transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Añadir Pregunta</span>
                </button>
              </div>

              <div className="space-y-4">
                {questions.map((q, qIndex) => (
                  <div key={q.id || qIndex} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {qIndex + 1}
                      </span>
                      <input
                        type="text"
                        required
                        placeholder={`Enunciado de la pregunta ${qIndex + 1}...`}
                        value={q.question}
                        onChange={(e) => handleUpdateQuestion(qIndex, 'question', e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-600 bg-white"
                      />
                      {questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestion(qIndex)}
                          title="Eliminar esta pregunta"
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="space-y-1.5 pl-8">
                      <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                        Opciones de respuesta (Seleccione el botón circular para marcar la correcta):
                      </span>
                      {q.options.map((opt, optIndex) => (
                        <div key={optIndex} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`correct-${qIndex}`}
                            checked={q.correctAnswerIndex === optIndex}
                            onChange={() => handleUpdateQuestion(qIndex, 'correctAnswerIndex', optIndex)}
                            title="Marcar como respuesta correcta"
                            className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                          <input
                            type="text"
                            required
                            placeholder={`Opción ${String.fromCharCode(65 + optIndex)}...`}
                            value={opt}
                            onChange={(e) => handleUpdateOption(qIndex, optIndex, e.target.value)}
                            className={`flex-1 px-2.5 py-1.5 rounded-lg border text-xs focus:outline-none bg-white ${
                              q.correctAnswerIndex === optIndex
                                ? 'border-emerald-500 bg-emerald-50/30 font-semibold text-emerald-950'
                                : 'border-slate-300 text-slate-800'
                            }`}
                          />
                          {q.correctAnswerIndex === optIndex && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded shrink-0">
                              ✓ Correcta
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="pl-8 pt-1">
                      <input
                        type="text"
                        placeholder="Explicación pedagógica de la respuesta correcta (opcional)..."
                        value={q.explanation || ''}
                        onChange={(e) => handleUpdateQuestion(qIndex, 'explanation', e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-[11px] text-slate-600 focus:outline-none focus:border-indigo-400 bg-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            {activeStep !== 'INFO' && (
              <button
                type="button"
                onClick={() => setActiveStep(activeStep === 'QUESTIONS' ? 'VIDEO' : 'INFO')}
                className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors"
              >
                Anterior
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {activeStep !== 'QUESTIONS' ? (
              <button
                type="button"
                onClick={() => setActiveStep(activeStep === 'INFO' ? 'VIDEO' : 'QUESTIONS')}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-all"
              >
                Siguiente Paso
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSave}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition-all hover:scale-[1.02]"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Guardar y Publicar Curso en Aula Virtual</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
