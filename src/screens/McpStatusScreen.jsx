import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Circle, CheckCircle2, AlertCircle } from 'lucide-react';
import { getMcpStatus } from '../services/vkusvillMcpAdapter';

export default function McpStatusScreen() {
  const navigate = useNavigate();
  const status = getMcpStatus();

  return (
    <div className="screen">
      {/* Back */}
      <button 
        onClick={() => navigate(-1)} 
        style={{ background: 'none', display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text-secondary)', marginBottom: 16, padding: '8px 0' }}
      >
        <ArrowLeft size={18} />
        <span style={{ fontSize: 14 }}>Назад</span>
      </button>

      <h1 style={{ marginBottom: 6 }}>MCP Status</h1>
      <p style={{ marginBottom: 20, fontSize: 13, color: 'var(--color-text-muted)' }}>
        Developer panel — VkusVill MCP integration status
      </p>

      {/* Mode */}
      <div className="card" style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Mode</span>
          <span style={{ 
            padding: '4px 12px', 
            borderRadius: 20, 
            fontSize: 12, 
            fontWeight: 600,
            background: status.mode === 'Demo' ? '#FFF3CD' : '#D4EDDA',
            color: status.mode === 'Demo' ? '#856404' : '#155724',
          }}>
            {status.mode}
          </span>
        </div>
      </div>

      {/* Services */}
      <div className="card" style={{ marginBottom: 12 }}>
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 600, marginBottom: 12 }}>
          MCP Services
        </p>
        {Object.entries(status.services).map(([service, state]) => (
          <div key={service} style={{ 
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '10px 0',
            borderBottom: '1px solid var(--color-border)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {state === 'connected' 
                ? <CheckCircle2 size={16} color="var(--color-success)" />
                : <Circle size={16} color="var(--color-warning)" />
              }
              <code style={{ fontSize: 13, color: 'var(--color-text)' }}>{service}</code>
            </div>
            <span style={{ 
              fontSize: 12, 
              color: state === 'connected' ? 'var(--color-success)' : 'var(--color-warning)',
              fontWeight: 500,
            }}>
              {state}
            </span>
          </div>
        ))}
      </div>

      {/* Endpoint */}
      <div className="card" style={{ marginBottom: 12 }}>
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 600, marginBottom: 6 }}>
          Endpoint
        </p>
        <code style={{ fontSize: 12, color: 'var(--color-text-secondary)', wordBreak: 'break-all' }}>
          {status.endpoint}
        </code>
      </div>

      {/* Last request/response */}
      <div className="card" style={{ marginBottom: 12 }}>
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 600, marginBottom: 6 }}>
          Last Request
        </p>
        <code style={{ fontSize: 12, color: 'var(--color-text-secondary)', display: 'block', padding: 8, background: 'var(--color-bg)', borderRadius: 6 }}>
          {status.lastRequest || 'none'}
        </code>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 600, marginBottom: 6 }}>
          Last Response
        </p>
        <code style={{ fontSize: 12, color: 'var(--color-text-secondary)', display: 'block', padding: 8, background: 'var(--color-bg)', borderRadius: 6 }}>
          {status.lastResponse || 'none'}
        </code>
      </div>

      {/* Info */}
      <div className="card" style={{ background: 'var(--color-accent-light)', border: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
          <AlertCircle size={16} color="var(--color-accent)" style={{ marginTop: 2, flexShrink: 0 }} />
          <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
            To connect real VkusVill MCP, set environment variables VITE_VKUSVILL_MCP_URL and VITE_VKUSVILL_MCP_TOKEN, 
            then set DEMO_MODE=false in services/vkusvillMcpAdapter.js. 
            Reference: habr.com/ru/companies/vkusvill/articles/981866/
          </p>
        </div>
      </div>
    </div>
  );
}
