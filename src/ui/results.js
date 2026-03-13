/**
 * 結果ダッシュボード描画
 */

import { upgradeTooltips } from './tooltips.js';
import { t } from '../i18n/index.js';

/**
 * サマリカードを表示する
 *
 * @param {Object} summary - 解析結果サマリ
 * @param {string} summary.affectedSide - 患側 ('left'|'right')
 * @param {number} summary.cvRatio - CV比
 * @param {number} summary.pursingEpisodes - 口すぼめエピソード数
 * @param {number} summary.pursingDuration - 口すぼめ合計時間(秒)
 * @param {number} summary.tonicMean - Tonic平均
 * @param {number} summary.tonicElevation - Tonic刺激時上昇
 * @param {number} summary.clonicEpisodes - 痙攣エピソード数
 * @param {number} summary.clonicRate - 痙攣発生率（/秒）
 * @param {number} summary.clonicCoverage - 痙攣カバレッジ（%）
 * @param {number} summary.clonicAmplitude - 平均振幅
 * @param {number} summary.clonicDurationMs - 平均持続時間（ms）
 */
export function renderSummary(summary) {
  const section = document.getElementById('results-section');
  const cards = document.getElementById('summary-cards');
  if (!section || !cards) return;

  section.style.display = 'block';

  const sideLabel = summary.affectedSide === 'left'
    ? t('results.side.left')
    : summary.affectedSide === 'right'
      ? t('results.side.right')
      : String(summary.affectedSide || '').toUpperCase();

  cards.innerHTML = `
    <div class="card">
      <div class="card-label" title="${t('results.cards.affectedSide.tooltip')}">
        ${t('results.cards.affectedSide.label')} <span class="info-icon">&#9432;</span>
      </div>
      <div class="card-value">${sideLabel}</div>
    </div>
    <div class="card">
      <div class="card-label" title="${t('results.cards.cvRatio.tooltip')}">
        ${t('results.cards.cvRatio.label')} <span class="info-icon">&#9432;</span>
      </div>
      <div class="card-value">${summary.cvRatio.toFixed(2)}</div>
    </div>
    <div class="card">
      <div class="card-label" title="${t('results.cards.pursingEpisodes.tooltip')}">
        ${t('results.cards.pursingEpisodes.label')} <span class="info-icon">&#9432;</span>
      </div>
      <div class="card-value">${summary.pursingEpisodes}</div>
    </div>
    <div class="card">
      <div class="card-label" title="${t('results.cards.pursingDuration.tooltip')}">
        ${t('results.cards.pursingDuration.label')} <span class="info-icon">&#9432;</span>
      </div>
      <div class="card-value">${summary.pursingDuration.toFixed(2)} ${t('results.units.seconds')}</div>
    </div>
    <div class="card">
      <div class="card-label" title="${t('results.cards.tonicMean.tooltip')}">
        ${t('results.cards.tonicMean.label')} <span class="info-icon">&#9432;</span>
      </div>
      <div class="card-value">${summary.tonicMean.toFixed(3)}</div>
    </div>
    <div class="card">
      <div class="card-label" title="${t('results.cards.tonicElevation.tooltip')}">
        ${t('results.cards.tonicElevation.label')} <span class="info-icon">&#9432;</span>
      </div>
      <div class="card-value">${summary.tonicElevation.toFixed(3)}</div>
    </div>
    <div class="card">
      <div class="card-label" title="${t('results.cards.spasmEpisodes.tooltip')}">
        ${t('results.cards.spasmEpisodes.label')} <span class="info-icon">&#9432;</span>
      </div>
      <div class="card-value">${summary.clonicEpisodes}</div>
    </div>
    <div class="card">
      <div class="card-label" title="${t('results.cards.spasmRate.tooltip')}">
        ${t('results.cards.spasmRate.label')} <span class="info-icon">&#9432;</span>
      </div>
      <div class="card-value">${summary.clonicRate.toFixed(3)} ${t('results.units.perSecond')}</div>
    </div>
    <div class="card">
      <div class="card-label" title="${t('results.cards.spasmCoverage.tooltip')}">
        ${t('results.cards.spasmCoverage.label')} <span class="info-icon">&#9432;</span>
      </div>
      <div class="card-value">${summary.clonicCoverage.toFixed(1)}%</div>
    </div>
    <div class="card">
      <div class="card-label" title="${t('results.cards.meanAmplitude.tooltip')}">
        ${t('results.cards.meanAmplitude.label')} <span class="info-icon">&#9432;</span>
      </div>
      <div class="card-value">${summary.clonicAmplitude.toFixed(3)}</div>
    </div>
    <div class="card">
      <div class="card-label" title="${t('results.cards.meanDuration.tooltip')}">
        ${t('results.cards.meanDuration.label')} <span class="info-icon">&#9432;</span>
      </div>
      <div class="card-value">${summary.clonicDurationMs.toFixed(0)} ${t('results.units.milliseconds')}</div>
    </div>
  `;

  upgradeTooltips(cards);
}
