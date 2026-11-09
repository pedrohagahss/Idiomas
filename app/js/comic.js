/**
 * Renderizador da HQ Digital Interativa (Comic Engine)
 */

export class ComicRenderer {
  constructor() {
    this.showPortuguese = true;
    this.currentSegmentIdx = -1;
  }

  togglePortuguese(show) {
    this.showPortuguese = show !== undefined ? show : !this.showPortuguese;
    const ptEl = document.getElementById('dialogue-pt');
    if (ptEl) {
      ptEl.style.display = this.showPortuguese ? 'block' : 'none';
    }
    const btn = document.getElementById('btn-toggle-pt');
    if (btn) {
      btn.classList.toggle('active', this.showPortuguese);
    }
  }

  getSfxForPanel(panelId) {
    const sfxList = {
      p1_1: 'BZZZT!',
      p1_2: 'SYS.ACTIF!',
      p1_3: 'CLIC!',
      p2_1: 'GLOU-GLOU!',
      p2_2: 'BIP-BIP!',
      p3_1: 'RENDER 3D!',
      p3_2: 'APPLAUSE!',
      p4_1: 'VROOOM!',
      p4_2: 'AI CONNECT!'
    };
    return sfxList[panelId] || 'POW!';
  }

  renderPanel(panel, scene, chapter, onSegmentClick) {
    // 1. Título do gibi e numeração de vinheta
    const allPanels = [];
    chapter.scenes.forEach(s => s.panels.forEach(p => allPanels.push(p)));
    const currentIdx = allPanels.findIndex(p => p.panel_id === panel.panel_id);
    
    document.getElementById('chapter-title').textContent = chapter.title_fr;
    document.getElementById('page-counter').textContent = `PANEL ${currentIdx + 1} / ${allPanels.length}`;

    // 2. Caixa de Narrador (Caption Box)
    const captionText = document.getElementById('caption-text');
    if (captionText) {
      captionText.textContent = panel.visual_description;
    }

    // 3. Arte Principal da HQ
    const imgEl = document.getElementById('comic-artwork-img');
    if (imgEl) {
      if (panel.image) {
        imgEl.src = panel.image;
        imgEl.style.display = 'block';
      } else {
        // Fallback para imagem gerada ou padrão
        imgEl.src = `../assets/img/${panel.panel_id}.png`;
        imgEl.onerror = () => {
          // Se ainda não tiver a imagem gerada deste painel, usa a p1_1 como referência visual
          imgEl.src = '../assets/img/p1_1.png';
        };
      }
    }

    // 4. Onomatopeia estilizada
    const sfxEl = document.getElementById('comic-sfx');
    if (sfxEl) {
      sfxEl.textContent = this.getSfxForPanel(panel.panel_id);
    }

    // 5. Balão de fala e Breath Groups
    const frEl = document.getElementById('dialogue-fr');
    frEl.innerHTML = '';

    const breathGroups = panel.breath_groups || [{ fr: panel.dialogue_fr }];
    breathGroups.forEach((bg, idx) => {
      const span = document.createElement('span');
      span.className = 'breath-segment';
      span.dataset.idx = idx;
      span.textContent = bg.fr + ' ';
      span.title = 'Tocar para ouvir este trecho';
      span.addEventListener('click', () => {
        if (onSegmentClick) onSegmentClick(bg.fr, idx);
      });
      frEl.appendChild(span);
    });

    // 6. Tradução nota do gibi
    const ptEl = document.getElementById('dialogue-pt');
    ptEl.textContent = `Trad. : « ${panel.dialogue_pt} »`;
    ptEl.style.display = this.showPortuguese ? 'block' : 'none';

    // 7. Fonética e dica
    document.getElementById('ipa-text').textContent = panel.phonetics_guide || '';
    document.getElementById('ipa-tip').textContent = panel.pronunciation_tip_pt ? `💡 ${panel.pronunciation_tip_pt}` : '';

    // 8. Miniaturas de vinhetas no rodapé
    const dotsContainer = document.getElementById('panel-dots');
    dotsContainer.innerHTML = '';
    allPanels.forEach((p, idx) => {
      const dot = document.createElement('div');
      dot.className = `comic-thumb-dot ${idx === currentIdx ? 'active' : ''}`;
      dot.title = `Case ${idx + 1}`;
      dotsContainer.appendChild(dot);
    });
  }

  highlightSegment(index) {
    this.currentSegmentIdx = index;
    const segments = document.querySelectorAll('.breath-segment');
    segments.forEach((seg) => {
      const idx = parseInt(seg.dataset.idx, 10);
      if (index === -1) {
        seg.classList.add('highlight');
      } else if (idx === index) {
        seg.classList.add('highlight');
      } else {
        seg.classList.remove('highlight');
      }
    });
  }
}

export const comicRenderer = new ComicRenderer();
