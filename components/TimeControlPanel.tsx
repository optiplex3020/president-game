import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useGameLoopEngine } from '../src/systems/GameLoopEngine';
import { useMasterGameEngine } from '../src/systems/MasterGameEngine';
import { useCalendarEngine } from '../src/systems/CalendarEngine';
import { useMilestoneEngine } from '../src/systems/MilestoneEngine';
import { DailyBriefingModal } from './DailyBriefingModal';
import { EndOfDaySummary } from './EndOfDaySummary';
import '../src/styles/TimeControlPanel.css';

export const TimeControlPanel: React.FC = () => {
  const {
    isRunning,
    timeScale,
    totalEventsTriggered,
    totalConsequencesExecuted,
    startGameLoop,
    stopGameLoop,
    setTimeScale,
    tick
  } = useGameLoopEngine();

  const {
    currentDate,
    dayInMandate,
    advanceDays,
    advanceTo
  } = useMasterGameEngine();
  const { getNextBlockingEvent } = useCalendarEngine();
  const { getUpcomingMilestones } = useMilestoneEngine();

  const [showDailyBriefing, setShowDailyBriefing] = useState(true);
  const [showEndOfDaySummary, setShowEndOfDaySummary] = useState(false);

  // Boucle de jeu
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = Date.now();

    const gameLoop = () => {
      const now = Date.now();
      const deltaTime = now - lastTime;
      lastTime = now;

      tick(deltaTime);

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    if (isRunning) {
      animationFrameId = requestAnimationFrame(gameLoop);
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isRunning, tick]);

  const handleAdvanceDays = useCallback(
    (days: number) => {
      if (days <= 0) return;
      advanceDays(days);
      setShowEndOfDaySummary(true);
    },
    [advanceDays]
  );

  const handleAdvanceToNextMajor = useCallback(() => {
    const nextBlocking = getNextBlockingEvent(currentDate);
    const [nextMilestone] = getUpcomingMilestones(currentDate, 1);

    const candidateDates = [
      nextBlocking?.date,
      nextMilestone?.date
    ].filter((date): date is Date => date instanceof Date);

    if (candidateDates.length === 0) {
      handleAdvanceDays(1);
      return;
    }

    const earliest = candidateDates.sort((a, b) => a.getTime() - b.getTime())[0];
    advanceTo(earliest);
    setShowEndOfDaySummary(true);
  }, [advanceTo, currentDate, getNextBlockingEvent, getUpcomingMilestones, handleAdvanceDays]);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const nextHighlightLabel = useMemo(() => {
    const nextBlocking = getNextBlockingEvent(currentDate);
    const [nextMilestone] = getUpcomingMilestones(currentDate, 1);
    const options = [
      nextBlocking ? { label: nextBlocking.title, date: nextBlocking.date } : null,
      nextMilestone ? { label: nextMilestone.title, date: nextMilestone.date } : null
    ].filter((item): item is { label: string; date: Date } => Boolean(item));

    if (options.length === 0) return null;

    const earliest = options.sort((a, b) => a.date.getTime() - b.date.getTime())[0];
    return `${earliest.label} — ${earliest.date.toLocaleDateString('fr-FR', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })}`;
  }, [currentDate, getNextBlockingEvent, getUpcomingMilestones]);

  const getTimeScaleLabel = () => {
    switch (timeScale) {
      case 'paused': return '⏸️ Pause';
      case 'slow': return '🐌 Lent';
      case 'normal': return '▶️ Normal';
      case 'fast': return '⏩ Rapide';
      case 'ultra': return '⚡ Ultra';
      default: return '▶️';
    }
  };

  const getTimeScaleColor = () => {
    switch (timeScale) {
      case 'paused': return 'gray';
      case 'slow': return 'blue';
      case 'normal': return 'green';
      case 'fast': return 'orange';
      case 'ultra': return 'red';
      default: return 'green';
    }
  };

  const handleDailyBriefing = useCallback(() => {
    setShowDailyBriefing(true);
  }, []);

  const handleCloseDailyBriefing = useCallback(() => {
    setShowDailyBriefing(false);
  }, []);

  const handleCloseSummary = useCallback(() => {
    setShowEndOfDaySummary(false);
    setShowDailyBriefing(true);
  }, []);

  return (
    <div className="time-control-panel-wrapper">
      <div className="time-control-panel">
        <div className="time-display">
          <div className="current-date">{formatDate(currentDate)}</div>
          <div className="mandate-info">
            <span className="mandate-day">Jour {dayInMandate}</span>
            <span className="mandate-progress"> / 1826 jours de mandat</span>
          </div>
          {nextHighlightLabel && (
            <div className="next-highlight">
              <span className="label">À venir :</span> {nextHighlightLabel}
            </div>
          )}
        </div>

        <div className="career-controls">
          <button className="time-btn" onClick={handleDailyBriefing}>
            🗓️ Briefing
          </button>
          <button className="time-btn" onClick={() => handleAdvanceDays(1)}>
            ➡️ Demain
          </button>
          <button className="time-btn" onClick={() => handleAdvanceDays(7)}>
            ⏭️ +7 jours
          </button>
          <button className="time-btn" onClick={handleAdvanceToNextMajor}>
            🎯 Prochain jalon
          </button>
        </div>

        <div className="time-controls">
          <button
            className={`time-btn ${timeScale === 'paused' ? 'active' : ''}`}
            onClick={() => {
              if (isRunning && timeScale !== 'paused') {
                stopGameLoop();
              } else {
                setTimeScale('paused');
              }
            }}
            title="Pause"
          >
            ⏸️
          </button>

          <button
            className={`time-btn ${timeScale === 'slow' ? 'active' : ''}`}
            onClick={() => {
              if (!isRunning) startGameLoop();
              setTimeScale('slow');
            }}
            title="Vitesse lente (x0.5)"
          >
            🐌
          </button>

          <button
            className={`time-btn ${timeScale === 'normal' ? 'active' : ''}`}
            onClick={() => {
              if (!isRunning) startGameLoop();
              setTimeScale('normal');
            }}
            title="Vitesse normale (x1)"
          >
            ▶️
          </button>

          <button
            className={`time-btn ${timeScale === 'fast' ? 'active' : ''}`}
            onClick={() => {
              if (!isRunning) startGameLoop();
              setTimeScale('fast');
            }}
            title="Vitesse rapide (x3)"
          >
            ⏩
          </button>

          <button
            className={`time-btn ${timeScale === 'ultra' ? 'active' : ''}`}
            onClick={() => {
              if (!isRunning) startGameLoop();
              setTimeScale('ultra');
            }}
            title="Vitesse ultra (x10)"
          >
            ⚡
          </button>

          <div className={`time-scale-indicator ${getTimeScaleColor()}`}>
            {getTimeScaleLabel()}
          </div>
        </div>

        <div className="game-stats">
          <div className="stat-item">
            <span className="stat-icon">📢</span>
            <span className="stat-value">{totalEventsTriggered}</span>
            <span className="stat-label">Événements</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">⚡</span>
            <span className="stat-value">{totalConsequencesExecuted}</span>
            <span className="stat-label">Conséquences</span>
          </div>
        </div>
      </div>

      <DailyBriefingModal isOpen={showDailyBriefing} onClose={handleCloseDailyBriefing} />
      <EndOfDaySummary isOpen={showEndOfDaySummary} onContinue={handleCloseSummary} />
    </div>
  );
};
