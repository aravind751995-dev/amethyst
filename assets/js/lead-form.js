(() => {
  const root = document.createElement('div');
  root.className = 'amethyst-planner';
  root.setAttribute('aria-hidden','true');
  root.innerHTML = `
    <div class="planner-card" role="dialog" aria-modal="true" aria-labelledby="planner-title">
      <div class="planner-top">
        <button class="planner-close" type="button" aria-label="Close planner">×</button>
        <div class="planner-kicker">AMETHYST</div>
        <h2 id="planner-title">Let's Plan Your Experience.</h2>
        <p>Tell us a little about your plan. We'll help you shape the journey around your dates, group and preferences.</p>
      </div>
      <div class="planner-body">
        <div class="planner-progress" aria-hidden="true">
          <span class="active"></span><span></span><span></span><span></span>
        </div>

        <section class="planner-step active" data-step="1">
          <h3>First, tell us about you.</h3>
          <p class="planner-help">We'll use these details to get back to you about your plan.</p>
          <div class="planner-fields">
            <div class="planner-field"><label for="planner-name">Name</label><input id="planner-name" autocomplete="name" required placeholder="Your name"></div>
            <div class="planner-field"><label for="planner-phone">Contact Number</label><input id="planner-phone" autocomplete="tel" inputmode="tel" required placeholder="10 digit mobile number"></div>
            <div class="planner-field">
              <label>What are you planning?</label>
              <div class="planner-options">
                <div class="planner-option"><input id="ptype-tour" name="planner-type" value="Tour" type="radio"><label for="ptype-tour">Tour</label></div>
                <div class="planner-option"><input id="ptype-yatra" name="planner-type" value="Yatra" type="radio"><label for="ptype-yatra">Yatra</label></div>
                <div class="planner-option"><input id="ptype-surprise" name="planner-type" value="Surprise" type="radio"><label for="ptype-surprise">Surprise</label></div>
                <div class="planner-option"><input id="ptype-retreat" name="planner-type" value="Retreat" type="radio"><label for="ptype-retreat">Retreat</label></div>
                <div class="planner-option"><input id="ptype-trekking" name="planner-type" value="Trekking" type="radio"><label for="ptype-trekking">Trekking</label></div>
                <div class="planner-option"><input id="ptype-rental" name="planner-type" value="Vehicle Rental" type="radio"><label for="ptype-rental">Vehicle Rental</label></div>
                <div class="planner-option"><input id="ptype-other" name="planner-type" value="Other" type="radio"><label for="ptype-other">Other</label></div>
              </div>
            </div>
          </div>
        </section>

        <section class="planner-step" data-step="2">
          <h3>Now, tell us the plan.</h3>
          <p class="planner-help">Where do you want to go and what would you like to experience?</p>
          <div class="planner-fields">
            <div class="planner-field"><label for="planner-destination">Where would you like to go?</label><input id="planner-destination" required placeholder="Destination or place"></div>
            <div class="planner-field"><label for="planner-plan">What's the plan?</label><textarea id="planner-plan" required placeholder="Tell us what you have in mind"></textarea></div>
          </div>
        </section>

        <section class="planner-step" data-step="3">
          <h3>Let's get the trip details.</h3>
          <p class="planner-help">These details help us suggest the right route, vehicle and stay.</p>
          <div class="planner-fields two">
            <div class="planner-field"><label for="planner-members">How many members?</label><input id="planner-members" required type="number" min="1" max="999" inputmode="numeric" placeholder="Number of people"></div>
            <div class="planner-field"><label for="planner-date">Date of the plan</label><input id="planner-date" required type="date"></div>
          </div>
          <div class="planner-fields" style="margin-top:16px">
            <div class="planner-field"><label for="planner-pickup">Pickup location</label><input id="planner-pickup" required placeholder="Pickup point or area in Chennai"></div>
          </div>
        </section>

        <section class="planner-step" data-step="4">
          <h3>One last detail.</h3>
          <p class="planner-help">Anything else you'd like us to know before we contact you?</p>
          <div class="planner-field"><label for="planner-notes">Additional requirements</label><textarea id="planner-notes" placeholder="Stay preference, temple visits, vehicle preference, budget, celebration idea or anything else"></textarea></div>
          <div class="planner-summary" id="planner-summary"></div>
          <p class="planner-note">Your details will be prepared as a WhatsApp enquiry for Amethyst.</p>
        </section>

        <div class="planner-nav">
          <button class="planner-btn secondary" type="button" id="planner-back" style="display:none">BACK</button>
          <span></span>
          <button class="planner-btn" type="button" id="planner-next">CONTINUE</button>
        </div>
      </div>
    </div>`;
  document.body.appendChild(root);

  const steps = [...root.querySelectorAll('.planner-step')];
  const progress = [...root.querySelectorAll('.planner-progress span')];
  const back = root.querySelector('#planner-back');
  const next = root.querySelector('#planner-next');
  const close = root.querySelector('.planner-close');
  let step = 1;

  const $ = id => root.querySelector(id);
  const value = id => $(id).value.trim();
  const typeValue = () => {
    const checked = root.querySelector('input[name="planner-type"]:checked');
    return checked ? checked.value : '';
  };

  function openPlanner(){
    step = 1;
    showStep();
    root.classList.add('is-open');
    root.setAttribute('aria-hidden','false');
    document.body.classList.add('planner-locked');
    setTimeout(() => $('#planner-name').focus(), 80);
  }

  function closePlanner(){
    root.classList.remove('is-open');
    root.setAttribute('aria-hidden','true');
    document.body.classList.remove('planner-locked');
  }

  function showStep(){
    steps.forEach((el,i) => el.classList.toggle('active', i === step - 1));
    progress.forEach((el,i) => el.classList.toggle('active', i < step));
    back.style.display = step > 1 ? 'inline-block' : 'none';
    next.textContent = step === 4 ? 'SEND MY PLAN' : 'CONTINUE';
    if(step === 4) buildSummary();
  }

  function validStep(){
    if(step === 1){
      const phone = value('#planner-phone').replace(/\D/g,'');
      if(!value('#planner-name')) return alert('Please enter your name.'), false;
      if(phone.length < 10) return alert('Please enter a valid contact number.'), false;
      if(!typeValue()) return alert('Please select what you are planning.'), false;
    }
    if(step === 2){
      if(!value('#planner-destination')) return alert('Please tell us where you would like to go.'), false;
      if(!value('#planner-plan')) return alert('Please tell us what you have in mind.'), false;
    }
    if(step === 3){
      if(!value('#planner-members')) return alert('Please enter the number of members.'), false;
      if(!value('#planner-date')) return alert('Please select the date of the plan.'), false;
      if(!value('#planner-pickup')) return alert('Please enter the pickup location.'), false;
    }
    return true;
  }

  function buildSummary(){
    $('#planner-summary').innerHTML = `
      <p><strong>Name:</strong> ${escapeHtml(value('#planner-name'))}<br>
      <strong>Contact:</strong> ${escapeHtml(value('#planner-phone'))}<br>
      <strong>Experience:</strong> ${escapeHtml(typeValue())}<br>
      <strong>Destination:</strong> ${escapeHtml(value('#planner-destination'))}<br>
      <strong>Members:</strong> ${escapeHtml(value('#planner-members'))}<br>
      <strong>Date:</strong> ${escapeHtml(value('#planner-date'))}<br>
      <strong>Pickup:</strong> ${escapeHtml(value('#planner-pickup'))}</p>`;
  }

  function escapeHtml(s){
    return s.replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[ch]));
  }

  function sendWhatsApp(){
    const notes = value('#planner-notes') || 'None';
    const message = [
      'NEW AMETHYST ENQUIRY',
      '',
      'Name: ' + value('#planner-name'),
      'Contact: ' + value('#planner-phone'),
      'Experience: ' + typeValue(),
      'Destination: ' + value('#planner-destination'),
      'Plan: ' + value('#planner-plan'),
      'Members: ' + value('#planner-members'),
      'Date: ' + value('#planner-date'),
      'Pickup: ' + value('#planner-pickup'),
      'Additional requirements: ' + notes
    ].join('\n');
    window.open('https://wa.me/919363402164?text=' + encodeURIComponent(message), '_blank', 'noopener');
    closePlanner();
  }

  next.addEventListener('click', () => {
    if(!validStep()) return;
    if(step < 4){ step += 1; showStep(); }
    else sendWhatsApp();
  });
  back.addEventListener('click', () => { if(step > 1){ step -= 1; showStep(); } });
  close.addEventListener('click', closePlanner);
  root.addEventListener('click', e => { if(e.target === root) closePlanner(); });
  document.addEventListener('keydown', e => { if(e.key === 'Escape' && root.classList.contains('is-open')) closePlanner(); });
  document.addEventListener('click', e => {
    const trigger = e.target.closest('[data-open-plan]');
    if(trigger){ e.preventDefault(); openPlanner(); }
  });
})();