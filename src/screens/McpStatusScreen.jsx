import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Wifi, WifiOff } from 'lucide-react';
import { getMcpStatus } from '../services/vkusvillMcpAdapter';

export default function McpStatusScreen() {
  const navigate = useNavigate();
  const status = getMcpStatus();

  return (
    <div className="screen">
      <button onClick={() => navigate(-1)} style={{ background: 'none', display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text-secondary)', marginBottom: 16, padding: '8px 0' }}>
        <ArrowLeft size={18} /><span style={{ fontSize: 14 }}>Назад</span>
      </button>
      <h1 style={{ marginBottom: 4 }}>MCP Status</h1>
      <p style={{ marginBottom: 20, fontSize: 13, color: 'var(--color-text-muted)' }}>Dev screen for partners and team</p>
      <div className="card" style={{ marginBottom: 12 }}>
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 500, textTransform: 'uppercase', marginBottom: 4 }}>Mode</p>
        <p style={{ fontSize: 16, fontWeight: 600, color: status.mode === 'Demo' ? 'var(--color-warning)' : 'var(--color-success)' }}>{status.mode}</p>
      </div>
      <div className="card" style={{ marginBottom: 12 }}>
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 500, textTransform: 'uppercase', marginBottom: 10 }}>Connection Status</p>
        {Object.entries(status.services).map(([name, st]) => (
          <div key={name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--color-border)' }}>
            <span style={{ fontSize: 14, fontFamily: 'monospace' }}>{name}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: st === 'connected' ? 'var(--color-success)' : 'var(--color-warning)' }}>
              {st === 'connected' ? <Wifi size={14} /> : <WifiOff size={14} />} {st}
            </span>
          </div>
        ))}
      </div>
      <div className="card" style={{ marginBottom: 12 }}>
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 500, textTransform: 'uppercase', marginBottom: 4 }}>Endpoint</p>
        <p style={{ fontSize: 13, fontFamily: 'monospace', color: 'var(--color-text)' }}>{status.endpoint}</p>
      </div>
      <div className="card" style={{ marginBottom: 12 }}>
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 500, textTransform: 'uppercase', marginBottom: 4 }}>Last Request</p>
        <p style={{ fontSize: 13, fontFamily: 'monospace', color: 'var(--color-text)', wordBreak: 'break-all' }}>{status.lastRequest || 'N/A'}</p>
      </div>
      <div className="card" style={{ marginBottom: 12 }}>
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 500, textTransform: 'uppercase', marginBottom: 4 }}>Last Response</p>
        <p style={{ fontSize: 13, fontFamily: 'monospace', color: 'var(--color-text)', wordBreak: 'break-all' }}>{status.lastResponse || 'N/A'}</p>
      </div>
    </div>
  );
}
