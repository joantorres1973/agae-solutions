'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/lib/store';
import {
  GraduationCap,
  Video,
  Play,
  CheckCircle2,
  AlertTriangle,
  Award,
  Clock,
  Printer,
  ChevronRight,
  RotateCcw,
  QrCode,
  Building,
  User,
  ArrowLeft,
  X
} from 'lucide-react';
import { VirtualCourse, VirtualCertificate, QuizQuestion } from '@/types/training';

interface PublicCoursePlayerProps {
  courseCode?: string;
  onClose?: () => void;
}

export const PublicCoursePlayer: React.FC<PublicCoursePlayerProps> = ({
  courseCode,
  onClose
}) => {
  const {
    organization,
    workers,
    trainingState,
    completeVirtualCourseForWorker,
    showNotification
  } = useApp();

  // Find course by code, token or id; fallback to first published course
  const selectedCourse = useMemo(() => {
    if (!courseCode) return trainingState.virtualCourses[0] || null;
    const clean = courseCode.trim().toLowerCase();
    const found = trainingState.virtualCourses.find(
      c => c.code.toLowerCase() === clean || c.id.toLowerCase() === clean || c.publicEnrollmentUrlToken.toLowerCase() === clean
    );
    return found || trainingState.virtualCourses[0] || null;
  }, [courseCode, trainingState.virtualCourses]);

  const [activeCourse, setActiveCourse] = useState<VirtualCourse | null>(selectedCourse);

  // Stepper: 1. REGISTRATION -> 2. VIDEO -> 3. QUIZ -> 4. RESULT
  const [step, setStep] = useState<'REGISTRATION' | 'VIDEO' | 'QUIZ' | 'RESULT'>('REGISTRATION');

  // Registration data
  const [docNumber, setDocNumber] = useState('');
  const [workerName, setWorkerName] = useState('');
  const [workerPosition, setWorkerPosition] = useState('');

  // Video playback data
  const [videoWatched, setVideoWatched] = useState(false);
  const [videoProgressPercent, setVideoProgressPercent] = useState(0);

  // Quiz data
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizResult, setQuizResult] = useState<{
    score: number;
    passed: boolean;
    certificate?: VirtualCertificate;
  } | null>(null);

  // Worker lookup by Cédula
  const handleDocChange = (val: string) => {
    setDocNumber(val);
    const clean = val.trim();
    if (!clean) return;
    const matched = workers.find(w => w.docNumber.trim() === clean);
    if (matched) {
      setWorkerName(`${matched.firstName} ${matched.lastName}`);
      setWorkerPosition(matched.position || 'Colaborador');
    }
  };

  // Convert YouTube / Vimeo URL to Embed URL
  const getEmbedVideoUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('youtube.com/watch') || url.includes('youtu.be/')) {
      const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
      if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}?autoplay=1`;
      }
    }
    if (url.includes('vimeo.com/')) {
      const match = url.match(/vimeo\.com\/(\d+)/);
      if (match && match[1]) {
        return `https://player.vimeo.com/video/${match[1]}?autoplay=1`;
      }
    }
    return url;
  };

  // Submit Quiz
  const handleSubmitQuiz = () => {
    if (!activeCourse) return;

    let correctCount = 0;
    activeCourse.questions.forEach((q: QuizQuestion) => {
      if (quizAnswers[q.id] === q.correctAnswerIndex) {
        correctCount++;
      }
    });

    const totalQ = activeCourse.questions.length || 1;
    const score = Math.round((correctCount / totalQ) * 100);
    const passed = score >= activeCourse.minPassingPercentage;

    const result = completeVirtualCourseForWorker({
      courseId: activeCourse.id,
      workerDocNumber: docNumber,
      workerName: workerName || 'Participante Aula Virtual',
      scorePercentage: score,
      answers: quizAnswers
    });

    setQuizResult({
      score,
      passed,
      certificate: result.certificate
    });

    setStep('RESULT');
  };

  // Print Certificate safely
  const handlePrintCertificate = () => {
    window.print?.();
  };

  if (!activeCourse) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
        <div className="max-w-md w-full bg-white p-6 rounded-2xl border border-slate-200 text-center space-y-4">
          <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
          <h2 className="text-base font-bold text-slate-900">Curso No Encontrado</h2>
          <p className="text-xs text-slate-600">
            El enlace de la capacitación no corresponde a un curso activo en el Aula Virtual.
          </p>
          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
            >
              Cerrar
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] text-slate-800 flex flex-col justify-between">
      
      {/* Top Header - Branded for the Student / Worker */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-4 py-3 shadow-xs print:hidden">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-indigo-600 text-white shadow-sm">
              <GraduationCap className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-slate-900 text-sm tracking-tight">
                  AGAE SOLUTIONS • Aula Virtual
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase">
                  Acceso Público Abierto
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-semibold block">
                {organization.name} • NIT {organization.nit}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onClose && (
              <button
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Salir</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl w-full mx-auto p-4 sm:p-6 my-auto flex-1">
        
        {/* Banner of the current course */}
        <div className="mb-6 p-4 rounded-2xl bg-white border border-indigo-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-indigo-700 font-bold mb-0.5">
              <span>{activeCourse.code}</span>
              <span>•</span>
              <span>{activeCourse.category.replace(/_/g, ' ')}</span>
            </div>
            <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              {activeCourse.title}
            </h1>
            <p className="text-xs text-slate-600 mt-0.5 max-w-2xl line-clamp-2">
              {activeCourse.description}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 text-xs">
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Intensidad</span>
              <span className="font-mono font-bold text-slate-800 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                {activeCourse.durationMinutes} min
              </span>
            </div>
            <div className="text-right border-l border-slate-200 pl-3">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Aprobación</span>
              <span className="font-mono font-bold text-emerald-700">
                Mínimo {activeCourse.minPassingPercentage}%
              </span>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* STEP 1: REGISTRO / IDENTIFICACIÓN DEL TRABAJADOR */}
        {/* ============================================================== */}
        {step === 'REGISTRATION' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg space-y-6 max-w-lg mx-auto print:hidden animate-fadeIn">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 mx-auto flex items-center justify-center shadow-inner">
                <User className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Identificación del Colaborador
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Esta capacitación <strong>no requiere usuario ni contraseña</strong>. Ingrese su cédula y nombre completo para emitir su certificado oficial y registrar su asistencia en el sistema de la empresa.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Número de Cédula o Documento de Identidad *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: 1018456789"
                  value={docNumber}
                  onChange={(e) => handleDocChange(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-mono font-bold text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all bg-slate-50/50"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Si ya está registrado en la empresa, sus datos se completarán automáticamente.
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Nombre Completo del Trabajador *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nombres y Apellidos tal como aparecen en su cédula"
                  value={workerName}
                  onChange={(e) => setWorkerName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Cargo / Área (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej: Conductor / Operario / Auxiliar"
                  value={workerPosition}
                  onChange={(e) => setWorkerPosition(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-indigo-600 bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Empresa
                </label>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700">
                  <Building className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>{organization.name}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              disabled={!docNumber.trim() || !workerName.trim()}
              onClick={() => setStep('VIDEO')}
              className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
            >
              <span>Comenzar Capacitación</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ============================================================== */}
        {/* STEP 2: VIDEO INTERACTIVO */}
        {/* ============================================================== */}
        {step === 'VIDEO' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg space-y-6 print:hidden animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 block">
                  Paso 1 de 2: Video de Formación
                </span>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  Visualice el contenido audiovisual de la capacitación
                </h3>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-600">
                <span className="font-semibold text-slate-900">Participante:</span>
                <span className="font-bold text-indigo-700">{workerName}</span>
              </div>
            </div>

            {/* Video Player */}
            <div className="rounded-2xl border-2 border-slate-300 bg-slate-950 overflow-hidden shadow-xl aspect-video relative flex items-center justify-center">
              {activeCourse.videoUrl.includes('youtube.com') || activeCourse.videoUrl.includes('youtu.be') || activeCourse.videoUrl.includes('vimeo.com') ? (
                <iframe
                  src={getEmbedVideoUrl(activeCourse.videoUrl)}
                  title={activeCourse.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : activeCourse.videoUrl.endsWith('.mp4') || activeCourse.videoUrl.includes('commondatastorage') ? (
                <video
                  controls
                  className="w-full h-full object-contain"
                  src={activeCourse.videoUrl}
                  poster={activeCourse.videoThumbnailUrl}
                  onEnded={() => {
                    setVideoWatched(true);
                    setVideoProgressPercent(100);
                  }}
                >
                  Tu navegador no soporta video HTML5.
                </video>
              ) : (
                <div className="text-center p-6 text-white space-y-3">
                  <Play className="w-12 h-12 mx-auto text-indigo-400" />
                  <p className="text-sm font-bold">{activeCourse.title}</p>
                  <p className="text-xs text-slate-300 max-w-md mx-auto">{activeCourse.description}</p>
                  <button
                    onClick={() => {
                      setVideoWatched(true);
                      setVideoProgressPercent(100);
                    }}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
                  >
                    Marcar Video como Visto
                  </button>
                </div>
              )}
            </div>

            {/* Controls & Advance to Quiz */}
            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-xs text-indigo-950 space-y-0.5">
                <span className="font-bold block">Instrucción para continuar:</span>
                <p className="text-indigo-800">
                  Una vez haya comprendido el video, haga clic en el botón para presentar la evaluación de <strong>{activeCourse.questions.length} preguntas</strong>.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setStep('QUIZ')}
                  className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-1.5"
                >
                  <span>Presentar Evaluación ({activeCourse.questions.length} Preguntas)</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* STEP 3: EVALUACIÓN INTERACTIVA */}
        {/* ============================================================== */}
        {step === 'QUIZ' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg space-y-6 print:hidden animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 block">
                  Paso 2 de 2: Evaluación de Conocimientos
                </span>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  Responda las {activeCourse.questions.length} preguntas del cuestionario
                </h3>
              </div>

              <div className="text-xs text-slate-600 font-medium">
                Puntaje mínimo de aprobación: <strong className="text-emerald-700 font-bold">{activeCourse.minPassingPercentage}%</strong>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-5">
              {activeCourse.questions.map((q: QuizQuestion, qIndex: number) => (
                <div key={q.id || qIndex} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {qIndex + 1}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm leading-snug">
                      {q.question}
                    </h4>
                  </div>

                  <div className="space-y-2 pl-9">
                    {q.options.map((opt: string, optIndex: number) => {
                      const isSelected = quizAnswers[q.id] === optIndex;
                      return (
                        <label
                          key={optIndex}
                          className={`flex items-center gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-indigo-50 border-indigo-500 font-bold text-indigo-950 shadow-xs'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100/80'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`quiz-${q.id}`}
                            checked={isSelected}
                            onChange={() => setQuizAnswers(prev => ({ ...prev, [q.id]: optIndex }))}
                            className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="flex-1">{opt}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Quiz */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="text-xs text-slate-600">
                Preguntas respondidas: <strong>{Object.keys(quizAnswers).length}</strong> de <strong>{activeCourse.questions.length}</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStep('VIDEO')}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100"
                >
                  Repasar Video
                </button>

                <button
                  type="button"
                  disabled={Object.keys(quizAnswers).length < activeCourse.questions.length}
                  onClick={handleSubmitQuiz}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Finalizar y Calificar Evaluación</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* STEP 4: RESULTADO Y CERTIFICADO OFICIAL */}
        {/* ============================================================== */}
        {step === 'RESULT' && quizResult && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Header del resultado (oculto al imprimir) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg text-center space-y-4 print:hidden">
              {quizResult.passed ? (
                <div className="space-y-3">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-md">
                    <Award className="w-9 h-9" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                    ¡Felicitaciones, {workerName}! Has Aprobado
                  </h2>
                  <p className="text-xs text-slate-600">
                    Tu calificación fue de <strong className="text-emerald-700 text-base">{quizResult.score}%</strong> (Mínimo requerido: {activeCourse.minPassingPercentage}%). Tu asistencia y certificación quedaron registradas en el SG-SST de {organization.name}.
                  </p>
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handlePrintCertificate}
                      className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-lg flex items-center gap-2 transition-transform hover:scale-[1.02]"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Descargar / Imprimir Certificado en PDF</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-700 mx-auto flex items-center justify-center shadow-md">
                    <AlertTriangle className="w-9 h-9" />
                  </div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">
                    Evaluación No Aprobada ({quizResult.score}%)
                  </h2>
                  <p className="text-xs text-slate-600">
                    Se requería un mínimo de <strong>{activeCourse.minPassingPercentage}%</strong> para obtener la certificación. Puedes repasar el video y reintentar la evaluación.
                  </p>
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setQuizAnswers({});
                        setStep('QUIZ');
                      }}
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Reintentar Evaluación</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep('VIDEO')}
                      className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100"
                    >
                      Repasar Video
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ============================================================== */}
            {/* DOCUMENTO OFICIAL: CERTIFICADO DIGITAL AGAE (#printable-certificate) */}
            {/* Este contenedor es el único que se imprime de forma limpia en PDF */}
            {/* ============================================================== */}
            {quizResult.passed && quizResult.certificate && (
              <div
                id="printable-certificate"
                className="bg-white rounded-3xl max-w-3xl w-full mx-auto p-8 sm:p-12 shadow-2xl border-8 border-emerald-700 space-y-6 text-center relative"
              >
                {/* Borde ornamental y cabecera institucional */}
                <div className="flex items-center justify-between border-b-2 border-emerald-600/40 pb-4">
                  <div className="flex items-center gap-3 text-left">
                    <span className="p-2.5 rounded-2xl bg-emerald-700 text-white">
                      <GraduationCap className="w-7 h-7" />
                    </span>
                    <div>
                      <span className="font-black text-slate-900 text-base tracking-tight block">
                        AGAE SOLUTIONS
                      </span>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold">
                        SISTEMA INTEGRADO DE GESTIÓN HSEQ • DECRETO 1072 DE 2015
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-500 block uppercase">
                      CÓDIGO DE VERIFICACIÓN
                    </span>
                    <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {quizResult.certificate.code}
                    </span>
                  </div>
                </div>

                {/* Contenido Central del Certificado */}
                <div className="space-y-3 py-6">
                  <span className="text-xs font-black text-emerald-800 uppercase tracking-widest block font-sans">
                    CERTIFICADO OFICIAL DE FORMACIÓN Y APROBACIÓN
                  </span>
                  <p className="text-xs text-slate-500 italic">
                    Hace constar formalmente que el colaborador(a):
                  </p>
                  
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight uppercase border-b-2 border-slate-200 pb-2 inline-block max-w-2xl">
                    {quizResult.certificate.workerName}
                  </h2>

                  <p className="text-xs font-mono font-bold text-slate-700">
                    Cédula de Ciudadanía / Documento de Identidad: {quizResult.certificate.workerDocNumber}
                  </p>

                  <p className="text-xs text-slate-600 max-w-xl mx-auto pt-2">
                    Ha completado satisfactoriamente la totalidad del contenido multimedia y aprobado la evaluación de conocimientos del curso virtual:
                  </p>

                  <h3 className="text-lg sm:text-xl font-bold text-emerald-950 px-4 py-2 bg-emerald-50/60 rounded-xl inline-block max-w-2xl border border-emerald-200">
                    {quizResult.certificate.courseTitle}
                  </h3>

                  <p className="text-xs text-slate-600">
                    Con una intensidad académica de <strong>{quizResult.certificate.hours} horas</strong> y un resultado evaluativo de <strong>{quizResult.certificate.scorePercentage}%</strong>.
                  </p>
                </div>

                {/* Metadatos Legales, Fecha y Firmas */}
                <div className="grid grid-cols-2 gap-6 pt-6 border-t-2 border-slate-200 text-left text-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 block uppercase">
                      EMPRESA AFILIADA BENEFICIARIA
                    </span>
                    <span className="font-bold text-slate-900 block text-xs">
                      {quizResult.certificate.companyName}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono block">
                      NIT: {organization.nit}
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-2">
                      FECHA DE EMISIÓN: <strong>{quizResult.certificate.issueDate}</strong>
                    </span>
                  </div>

                  <div className="text-right flex flex-col justify-between items-end">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-slate-500 block uppercase">
                        FACILITADOR HSEQ
                      </span>
                      <span className="font-bold text-slate-900 block text-xs">
                        {quizResult.certificate.facilitatorName}
                      </span>
                      <span className="text-[10px] text-slate-500 italic block">
                        Especialista en Seguridad y Salud en el Trabajo
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-[10px] mt-3 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                      <QrCode className="w-4 h-4 shrink-0" />
                      <span>Certificado Digital Oficial • Autenticidad Válida</span>
                    </div>
                  </div>
                </div>

                {/* Disclaimer legal de pie de página */}
                <div className="text-[9px] text-slate-400 border-t border-slate-100 pt-3">
                  Documento emitido conforme al Artículo 2.2.4.6.11 del Decreto 1072 de 2015 y la Resolución 0312 de 2019 (Estándar 1.2). Su validez y trazabilidad pueden ser auditadas en la plataforma AGAE SOLUTIONS.
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer (oculto en impresión) */}
      <footer className="bg-white border-t border-slate-200 py-3 px-4 text-center text-xs text-slate-500 print:hidden">
        AGAE SOLUTIONS • Plataforma Tecnológica para la Gestión de Riesgos Laborales e HSEQ
      </footer>
    </div>
  );
};
