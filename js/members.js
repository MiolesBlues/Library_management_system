const membersElements = {
  status: document.getElementById('membersStatus'),
  timestamp: document.getElementById('membersTimestamp'),
  refreshButton: document.getElementById('refreshMembersButton'),
  form: document.getElementById('memberForm'),
  formTitle: document.getElementById('memberFormTitle'),
  cancelEditButton: document.getElementById('cancelMemberEditButton'),
  resetButton: document.getElementById('resetMemberButton'),
  saveButton: document.getElementById('saveMemberButton'),
  tableBody: document.getElementById('membersTableBody'),
  searchInput: document.getElementById('memberSearchInput'),
  membersCount: document.getElementById('membersCount'),
  visibleCount: document.getElementById('membersVisibleCount'),
  fields: {
    memberId: document.getElementById('memberId'),
    fullName: document.getElementById('memberName'),
    email: document.getElementById('memberEmail'),
    phone: document.getElementById('memberPhone'),
    membershipDate: document.getElementById('membershipDate')
  }
};

let membersClient = null;
let allMembers = [];
let filteredMembers = [];

function hasMembersPage() {
  return Boolean(membersElements.form && membersElements.tableBody);
}

function setMembersStatus(message, type = 'info') {
  if (!membersElements.status) {
    return;
  }

  membersElements.status.textContent = message;
  membersElements.status.className = `dashboard-status ${type}`;
}

function setMembersTimestamp(message) {
  if (membersElements.timestamp) {
    membersElements.timestamp.textContent = message;
  }
}

function setMembersButtonState(isLoading) {
  if (membersElements.refreshButton) {
    membersElements.refreshButton.disabled = isLoading;
    membersElements.refreshButton.textContent = isLoading ? 'Loading...' : 'Refresh members';
  }

  if (membersElements.saveButton) {
    membersElements.saveButton.disabled = isLoading;
    membersElements.saveButton.textContent = isLoading
      ? 'Saving...'
      : (membersElements.fields.memberId.value ? 'Update member' : 'Save member');
  }
}

function getMembersClient() {
  if (membersClient) {
    return membersClient;
  }

  if (!window.librarySupabase || !window.librarySupabase.isSupabaseConfigured()) {
    return null;
  }

  membersClient = window.librarySupabase.createSupabaseClient();
  return membersClient;
}

function getMembersConfigMessage() {
  if (typeof window.supabase === 'undefined') {
    return 'The Supabase library did not load. Check your internet connection or CDN access.';
  }

  if (typeof window.APP_CONFIG === 'undefined') {
    return 'Supabase config is missing. Copy js/config.example.js to js/config.js and add your project values.';
  }

  return 'Supabase is not configured yet. Add your project URL and anon key in js/config.js.';
}

function showMembersPlaceholder(message) {
  if (!membersElements.tableBody) {
    return;
  }

  membersElements.tableBody.innerHTML = `<tr><td colspan="5">${message}</td></tr>`;
}

function updateMembersCounters() {
  if (membersElements.membersCount) {
    membersElements.membersCount.textContent = String(allMembers.length);
  }

  if (membersElements.visibleCount) {
    membersElements.visibleCount.textContent = String(filteredMembers.length);
  }
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function formatDate(dateValue) {
  if (!dateValue) {
    return '—';
  }

  const date = new Date(`${dateValue}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return date.toLocaleDateString();
}

function getMemberSearchValue() {
  return membersElements.searchInput?.value.trim().toLowerCase() || '';
}

function renderMembersTable() {
  updateMembersCounters();

  if (!allMembers.length) {
    showMembersPlaceholder('No members found yet. Add your first member using the form.');
    return;
  }

  if (!filteredMembers.length) {
    showMembersPlaceholder('No members match your search.');
    return;
  }

  membersElements.tableBody.innerHTML = filteredMembers
    .map((member) => `
      <tr>
        <td><strong>${escapeHtml(member.full_name)}</strong></td>
        <td>${escapeHtml(member.email)}</td>
        <td>${escapeHtml(member.phone || '—')}</td>
        <td>${escapeHtml(formatDate(member.membership_date))}</td>
        <td>
          <div class="table-actions">
            <button class="button-secondary table-button" type="button" data-action="edit" data-member-id="${member.member_id}">Edit</button>
            <button class="button-secondary table-button danger-button" type="button" data-action="delete" data-member-id="${member.member_id}">Delete</button>
          </div>
        </td>
      </tr>
    `)
    .join('');
}

function applyMemberFilters() {
  const searchValue = getMemberSearchValue();

  filteredMembers = allMembers.filter((member) => {
    if (!searchValue) {
      return true;
    }

    const searchable = [member.full_name, member.email, member.phone, member.membership_date];
    return searchable.some((value) => String(value ?? '').toLowerCase().includes(searchValue));
  });

  renderMembersTable();
}

function resetMemberForm() {
  membersElements.form?.reset();
  membersElements.fields.memberId.value = '';
  membersElements.fields.membershipDate.value = new Date().toISOString().slice(0, 10);
  membersElements.formTitle.textContent = 'Add a new member';
  membersElements.cancelEditButton?.classList.add('hidden');
  if (membersElements.saveButton) {
    membersElements.saveButton.textContent = 'Save member';
  }
}

function startMemberEdit(memberId) {
  const member = allMembers.find((item) => String(item.member_id) === String(memberId));
  if (!member) {
    return;
  }

  membersElements.fields.memberId.value = member.member_id;
  membersElements.fields.fullName.value = member.full_name ?? '';
  membersElements.fields.email.value = member.email ?? '';
  membersElements.fields.phone.value = member.phone ?? '';
  membersElements.fields.membershipDate.value = member.membership_date ?? '';
  membersElements.formTitle.textContent = `Edit: ${member.full_name}`;
  membersElements.cancelEditButton?.classList.remove('hidden');
  membersElements.saveButton.textContent = 'Update member';
  membersElements.fields.fullName.focus();
}

function getMemberPayload() {
  const payload = {
    full_name: membersElements.fields.fullName.value.trim(),
    email: membersElements.fields.email.value.trim(),
    phone: membersElements.fields.phone.value.trim() || null,
    membership_date: membersElements.fields.membershipDate.value
  };

  if (!payload.full_name) {
    throw new Error('Full name is required.');
  }

  if (!payload.email) {
    throw new Error('Email is required.');
  }

  if (!payload.membership_date) {
    throw new Error('Membership date is required.');
  }

  return payload;
}

async function loadMembers() {
  if (!hasMembersPage()) {
    return;
  }

  const supabase = getMembersClient();
  if (!supabase) {
    setMembersStatus(getMembersConfigMessage(), 'warning');
    setMembersTimestamp('Last updated: waiting for configuration.');
    showMembersPlaceholder('Connect Supabase to load members.');
    return;
  }

  setMembersButtonState(true);
  setMembersStatus('Loading members from Supabase...', 'info');

  try {
    const { data, error } = await supabase
      .from('members')
      .select('member_id, full_name, email, phone, membership_date')
      .order('full_name', { ascending: true });

    if (error) {
      throw error;
    }

    allMembers = Array.isArray(data) ? data : [];
    applyMemberFilters();
    setMembersStatus('Members loaded successfully.', 'success');
    setMembersTimestamp(`Last updated: ${new Date().toLocaleString()}`);
  } catch (error) {
    console.error('Members loading error:', error);
    allMembers = [];
    filteredMembers = [];
    renderMembersTable();
    setMembersStatus('Could not load members. Check the members table, permissions, and configuration.', 'error');
    setMembersTimestamp('Last updated: load failed.');
  } finally {
    setMembersButtonState(false);
  }
}

async function saveMember(event) {
  event.preventDefault();

  const supabase = getMembersClient();
  if (!supabase) {
    setMembersStatus(getMembersConfigMessage(), 'warning');
    return;
  }

  try {
    const payload = getMemberPayload();
    const memberId = membersElements.fields.memberId.value;

    setMembersButtonState(true);
    setMembersStatus(memberId ? 'Updating member...' : 'Adding member...', 'info');

    let response;
    if (memberId) {
      response = await supabase
        .from('members')
        .update(payload)
        .eq('member_id', Number(memberId))
        .select()
        .single();
    } else {
      response = await supabase
        .from('members')
        .insert(payload)
        .select()
        .single();
    }

    if (response.error) {
      throw response.error;
    }

    resetMemberForm();
    setMembersStatus(memberId ? 'Member updated successfully.' : 'Member added successfully.', 'success');
    await loadMembers();
  } catch (error) {
    console.error('Members save error:', error);
    setMembersStatus(error.message || 'Could not save the member record.', 'error');
    setMembersTimestamp('Last updated: save failed.');
  } finally {
    setMembersButtonState(false);
  }
}

async function deleteMember(memberId) {
  const supabase = getMembersClient();
  if (!supabase) {
    setMembersStatus(getMembersConfigMessage(), 'warning');
    return;
  }

  const member = allMembers.find((item) => String(item.member_id) === String(memberId));
  const confirmed = window.confirm(`Delete "${member?.full_name || 'this member'}"? This cannot be undone.`);
  if (!confirmed) {
    return;
  }

  try {
    setMembersButtonState(true);
    setMembersStatus('Deleting member...', 'info');

    const { error } = await supabase
      .from('members')
      .delete()
      .eq('member_id', Number(memberId));

    if (error) {
      throw error;
    }

    if (String(membersElements.fields.memberId.value) === String(memberId)) {
      resetMemberForm();
    }

    setMembersStatus('Member deleted successfully.', 'success');
    await loadMembers();
  } catch (error) {
    console.error('Members delete error:', error);
    setMembersStatus(error.message || 'Could not delete the member. Existing loans may still reference this record.', 'error');
    setMembersTimestamp('Last updated: delete failed.');
  } finally {
    setMembersButtonState(false);
  }
}

function handleMembersTableClick(event) {
  const button = event.target.closest('button[data-action]');
  if (!button) {
    return;
  }

  const { action, memberId } = button.dataset;
  if (!memberId) {
    return;
  }

  if (action === 'edit') {
    startMemberEdit(memberId);
  }

  if (action === 'delete') {
    deleteMember(memberId);
  }
}

function initMembersPage() {
  if (!hasMembersPage()) {
    return;
  }

  resetMemberForm();
  showMembersPlaceholder('Members will appear here after loading.');

  membersElements.form?.addEventListener('submit', saveMember);
  membersElements.resetButton?.addEventListener('click', resetMemberForm);
  membersElements.cancelEditButton?.addEventListener('click', resetMemberForm);
  membersElements.refreshButton?.addEventListener('click', loadMembers);
  membersElements.searchInput?.addEventListener('input', applyMemberFilters);
  membersElements.tableBody?.addEventListener('click', handleMembersTableClick);

  loadMembers();
}

initMembersPage();
