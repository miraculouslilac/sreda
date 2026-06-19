import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useAppState } from '../hooks/useAppState';

const questions = [
  {
    key: 'days',
    question: 'На сколько дней собрать корзину?',
    options: [
      { value: 3, label: '3 дня' },
      { value: 5, label: '5 дней' },
      { value: 7, label: '7 дней' },
    ],
  },
  {
    key: 'people',
    question: 'Для скольких человек?',
    options: [
      { value: 1, label: '1' },
      { value: 2, label: '2' },
      { value: 'family', label: 'Семья' },
    ],
  },
  {
    key: 'budget',
    question: 'Бюджет?',
    options: [
      { value: '3000', label: 'до 3 000 ₽' },
      { value: '5000', label: '3 000–5 000 ₽' },
      { value: '8000', label: '5 000–8 000 ₽' },
      { value: 'flexible', label: 'Без строгого бюджета' },
    ],
  },
  {
    key: 'restrictions',
    question: 'Ограничения?',
    multiple: true,
    options: [
      { value: 'no_sugar', label: 'Без сахара' },
      { value: 'no_lactose', label: 'Без лактозы' },
      { value: 'no_gluten', label: 'Без глютена' },
      { value: 'vegetarian', label: 'Вегетарианское' },
      { value: 'none', label: 'Нет ограничений' },
    ],
  },
  {
    key: 'cookingTime',
    question: 'Сколько времени готовы готовить?',
    options: [
      { value: '10min', label: 'До 10 минут' },
      { value: '20min', label: 'До 20 минут' },
      { value: '40min', label: 'До 40 минут' },
      { value: 'ready', label: 'Хочу готовые блюда' },
    ],
  },
];

export default function OnboardingScreen() {
  const navigate = useNavigate();
  const { state, updateState } = useAppState();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    days: state.days || null,
    people: state.people || null,
    budget: state.budget || null,
    restrictions: state.restrictions || [],
    cookingTime: state.cookingTime || null,
  });

  const current = questions[step];
  const progress = ((step + 1) / questions.length) * 100;

  const handleSelect = (value) => {
    if (current.multiple) {
      const arr = answers[current.key] || [];
      if (value === 'none') {
        setAnswers({ ...answers, [current.key]: ['none'] });
      } else {
        const filtered = arr.filter(v => v !== 'none');
        if (filtered.includes(value)) {
          setAnswers({ ...answers, [current.key]: filtered.filter(v => v !== value) });
        } else {
          setAnswers({ ...answers, [current.key]: [...filtered, value] });
        }
      }
    } else {
      setAnswers({ ...answers, [current.key]: value });
      // Auto-advance after selection
      setTimeout(() => {
        if (step < questions.length - 1) {
          setStep(step + 1);
        } else {
          finishOnboarding({ ...answers, [current.key]: value });
        }
      }, 300);
    }
  };

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      finishOnboarding(answers);
    }
  };

  const finishOnboarding = (finalAnswers) => {
    updateState({ ...finalAnswers, onboardingComplete: true });
    navigate('/context');
  };

  const isSelected = (value) => {
    if (current.multiple) {
      return (answers[current.key] || []).includes(value);
    }
    return answers[current.key] === value;
  };

  const canProceed = current.multiple 
    ? (answers[current.key] || []).length > 0
    : answers[current.key] !== null;

  return (
    <div className="screen">
      {/* Back */}
      <button 
        onClick={() => step > 0 ? setStep(step - 1) : navigate('/goal')} 
        style={{ background: 'none', display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text-secondary)', marginBottom: 16, padding: '8px 0' }}
      >
        <ArrowLeft size={18} />
        <span style={{ fontSize: 14 }}>Назад</span>
      </button>

      {/* Progress */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ height: 4, background: 'var(--color-border)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: 'var(--color-primary)', borderRadius: 2, transition: 'width 0.3s' }} />
        </div>
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 8 }}>
          {step + 1} из {questions.length}
        </p>
      </div>

      {/* Question */}
      <h2 style={{ marginBottom: 20 }}>{current.question}</h2>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {current.options.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => handleSelect(value)}
            style={{
              padding: '16px 18px',
              background: isSelected(value) ? 'var(--color-primary-light)' : 'var(--color-white)',
              border: isSelected(value) ? '2px solid var(--color-primary)' : '1.5px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              fontSize: 15,
              fontWeight: isSelected(value) ? 600 : 400,
              color: isSelected(value) ? 'var(--color-primary-dark)' : 'var(--color-text)',
              textAlign: 'left',
              transition: 'all 0.2s',
              minHeight: 52,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Next button for multiple choice */}
      {current.multiple && canProceed && (
        <button 
          className="btn-primary" 
          onClick={handleNext}
          style={{ marginTop: 24 }}
        >
          Далее
          <ArrowRight size={18} />
        </button>
      )}
    </div>
  );
}
