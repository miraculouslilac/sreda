import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../hooks/useAppState';

const questions = [
  {
    id: 'days',
    question: 'На сколько дней собрать корзину?',
    options: [
      { value: 3, label: '3 дня' },
      { value: 5, label: '5 дней' },
      { value: 7, label: '7 дней' },
    ],
  },
  {
    id: 'people',
    question: 'Для скольких человек?',
    options: [
      { value: '1', label: '1' },
      { value: '2', label: '2' },
      { value: 'family', label: 'Семья' },
    ],
  },
  {
    id: 'budget',
    question: 'Бюджет?',
    options: [
      { value: '3000', label: 'до 3000 \u20BD' },
      { value: '5000', label: '3000\u20135000 \u20BD' },
      { value: '8000', label: '5000\u20138000 \u20BD' },
      { value: 'flexible', label: 'Без строгого бюджета' },
    ],
  },
  {
    id: 'restrictions',
    question: 'Ограничения:',
    multi: true,
    options: [
      { value: 'no_sugar', label: 'Без сахара' },
      { value: 'no_lactose', label: 'Без лактозы' },
      { value: 'no_gluten', label: 'Без глютена' },
      { value: 'vegetarian', label: 'Вегетарианское' },
      { value: 'none', label: 'Нет ограничений' },
    ],
  },
  {
    id: 'cookingTime',
    question: 'Сколько времени готовы готовить?',
    options: [
      { value: '10', label: 'До 10 минут' },
      { value: '20', label: 'До 20 минут' },
      { value: '40', label: 'До 40 минут' },
      { value: 'ready', label: 'Хочу готовые блюда' },
    ],
  },
];

export default function OnboardingScreen() {
  const navigate = useNavigate();
  const { state, updateState } = useAppState();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    days: state.days,
    people: state.people,
    budget: state.budget,
    restrictions: state.restrictions || [],
    cookingTime: state.cookingTime,
  });

  const current = questions[step];

  const handleSelect = (value) => {
    if (current.multi) {
      const arr = answers.restrictions || [];
      if (value === 'none') {
        setAnswers({ ...answers, restrictions: ['none'] });
      } else {
        const filtered = arr.filter(v => v !== 'none');
        const newArr = filtered.includes(value)
          ? filtered.filter(v => v !== value)
          : [...filtered, value];
        setAnswers({ ...answers, restrictions: newArr });
      }
    } else {
      const newAnswers = { ...answers, [current.id]: value };
      setAnswers(newAnswers);
      setTimeout(() => {
        if (step < questions.length - 1) {
          setStep(step + 1);
        } else {
          updateState(newAnswers);
          navigate('/context');
        }
      }, 300);
    }
  };

  const handleMultiNext = () => {
    const newAnswers = { ...answers };
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      updateState(newAnswers);
      navigate('/context');
    }
  };

  const isSelected = (value) => {
    if (current.multi) {
      return (answers.restrictions || []).includes(value);
    }
    return answers[current.id] === value;
  };

  return (
    <div className="screen" style={{ paddingTop: 24 }}>
      {/* Progress */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24 }}>
        {questions.map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 2,
            background: i <= step ? 'var(--color-primary)' : 'var(--color-border)',
            transition: 'background 0.3s',
          }} />
        ))}
      </div>

      {/* Agent avatar + question */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 24 }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'var(--color-primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          fontSize: 14, color: 'white', fontWeight: 700,
        }}>С</div>
        <div className="card" style={{ flex: 1, padding: 14 }}>
          <p style={{ fontSize: 16, fontWeight: 500, color: 'var(--color-text)' }}>
            {current.question}
          </p>
        </div>
      </div>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingLeft: 48 }}>
        {current.options.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => handleSelect(value)}
            style={{
              padding: '14px 18px',
              background: isSelected(value) ? 'var(--color-primary)' : 'var(--color-white)',
              color: isSelected(value) ? 'white' : 'var(--color-text)',
              border: isSelected(value) ? '2px solid var(--color-primary)' : '1.5px solid var(--color-border)',
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 500,
              textAlign: 'left',
              minHeight: 48,
              transition: 'all 0.2s',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Next button for multi-select */}
      {current.multi && (answers.restrictions || []).length > 0 && (
        <div style={{ paddingLeft: 48, marginTop: 16 }}>
          <button className="btn-primary" onClick={handleMultiNext}>
            Далее
          </button>
        </div>
      )}

      {/* Step counter */}
      <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'var(--color-text-muted)' }}>
        {step + 1} из {questions.length}
      </p>
    </div>
  );
}
