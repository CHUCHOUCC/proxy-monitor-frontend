const toJson = (value) => JSON.stringify(value, null, 2);

export default function LogDetails({ log }) {
  return (
    <div className="details">
      <p className="details__meta mono">
        requestId: {log.requestId} · {log.timestamp.toISOString()}
      </p>
      <div className="details__grid">
        <div>
          <h4>Parámetros de entrada</h4>
          <pre>{toJson(log.inputParams)}</pre>
        </div>
        <div>
          <h4>{log.isError() ? 'Error' : 'Respuesta completa'}</h4>
          {log.isError() ? (
            <pre className="pre--error">
              {`${log.errorType}: ${log.errorMessage}\n\n${log.stackTrace.join('\n')}`}
            </pre>
          ) : (
            <pre>{toJson(log.response)}</pre>
          )}
        </div>
      </div>
    </div>
  );
}
