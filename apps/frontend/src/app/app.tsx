import styles from './app.module.scss';

import { useEffect, useState } from 'react';
import type { HealthEndpointResponse } from '@erp/api-contracts';

export function App() {
  const [healthCheckResult, setHealthCheckResult] = useState<HealthEndpointResponse | undefined>(undefined);

  useEffect(() => {
    fetch("/api/health")
      .then(res => res.json())
      .then(
        (res: HealthEndpointResponse) => setHealthCheckResult(res),
        (error) =>console.error("Oops...", error),
      )
  }, []);

  const statusColorClass = (param: string): string =>
    param === 'up' || param === 'ok' ? styles.green : styles.red;

  return (
    <div>
      {
        healthCheckResult &&
        <table>
          <caption>
            Health Status: <b className={statusColorClass(healthCheckResult.health.status)}>{healthCheckResult.health.status}</b>
          </caption>
          <tbody>
            {
              Object.keys(healthCheckResult.health.details).map(detailKey => {
                const status = healthCheckResult.health.details[detailKey].status;
                return (
                  <tr key={detailKey}>
                    <td>{detailKey}</td>
                    <td className={statusColorClass(status)}>
                      {status}
                    </td>
                  </tr>
                )}
              )
            }
            <tr>
              <td>Users count:</td>
              <td>{healthCheckResult.usersCount}</td>
            </tr>
          </tbody>
        </table>
      }
    </div>
  );
}

export default App;
