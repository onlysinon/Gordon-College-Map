/* ==========================================================================
   GORDON COLLEGE INTERACTIVE CAMPUS MAP & DIRECTORY - JAVASCRIPT (app.js)
   ========================================================================== */

/**
 * APPLICATION STATE MANAGEMENT
 */
const state = {
  currentFloor: 1,
  activeCategory: "All",
  searchQuery: "",
  sortBy: "code",
  viewMode: "split", // 'split' | 'map' | 'list'
  isEditMode: false,
  selectedRoomId: null,
  activeRoute: null,
  
  // SVG Viewport Pan & Zoom State
  zoom: 1,
  panX: 0,
  panY: 0,
  isDragging: false,
  dragStartX: 0,
  dragStartY: 0,

  // Room Database (Stored by Floor Key 1-6)
  rooms: {
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: []
  }
};

/**
 * GORDON COLLEGE PRESET DATA TEMPLATES (Floors 1 - 6)
 */
const PRESET_ROOMS = {
  1: [
    { id: "r101", code: "101", name: "Registrar & Admissions Office", category: "Student Services", floor: 1, color: "#0a5c36", x: 140, y: 120, w: 220, h: 180, hours: "8:00 AM - 5:00 PM", capacity: "30 Staff / Students", desc: "Official student record processing, transcripts, enrollment, and grade verification." },
    { id: "r102", code: "102", name: "Cashier & Finance Hall", category: "Student Services", floor: 1, color: "#0a5c36", x: 400, y: 120, w: 200, h: 180, hours: "8:00 AM - 5:00 PM", capacity: "20 Staff / Students", desc: "Tuition fee payment counter, statement of accounts, and financial clearance." },
    { id: "r103", code: "103", name: "Student Central Canteen", category: "Facility", floor: 1, color: "#f5ab16", x: 640, y: 120, w: 320, h: 180, hours: "7:00 AM - 6:00 PM", capacity: "150 Dining", desc: "Main student cafeteria, snack bars, and beverage lounge." },
    { id: "r104", code: "104", name: "Clinic & Health Services", category: "Facility", floor: 1, color: "#e11d48", x: 140, y: 480, w: 200, h: 180, hours: "8:00 AM - 5:00 PM", capacity: "10 Medical", desc: "First aid medical care, emergency consultation, and health record filing." },
    { id: "r105", code: "105", name: "Student Affairs Office (OSA)", category: "Office", floor: 1, color: "#0284c7", x: 380, y: 480, w: 220, h: 180, hours: "8:00 AM - 5:00 PM", capacity: "15 Staff", desc: "Student organization accreditation, discipline, and campus activity approvals." },
    { id: "r106", code: "106", name: "Security & Safety Office", category: "Office", floor: 1, color: "#475569", x: 640, y: 480, w: 200, h: 180, hours: "24 Hours Daily", capacity: "8 Staff", desc: "Campus security dispatch, lost and found service desk, and ID verification." }
  ],
  2: [
    { id: "r201", code: "201", name: "CCS Mac Multi-Media Laboratory", category: "Laboratory", floor: 2, color: "#f5ab16", x: 140, y: 120, w: 240, h: 180, hours: "7:30 AM - 7:00 PM", capacity: "45 Workstations", desc: "Apple Mac workstations for UI/UX design, graphics, multimedia production, and app dev." },
    { id: "r202", code: "202", name: "CISCO Networking Laboratory", category: "Laboratory", floor: 2, color: "#f5ab16", x: 420, y: 120, w: 240, h: 180, hours: "7:30 AM - 7:00 PM", capacity: "40 Workstations", desc: "Hardware routing racks, switch configuration benches, and data communication equipment." },
    { id: "r203", code: "203", name: "CCS Faculty Lounge & Dean's Office", category: "Office", floor: 2, color: "#0284c7", x: 700, y: 120, w: 240, h: 180, hours: "8:00 AM - 5:00 PM", capacity: "20 Faculty", desc: "College of Computer Studies Administrative & Faculty Consultation Office." },
    { id: "r204", code: "204", name: "Lecture Classroom 204", category: "Classroom", floor: 2, color: "#10b981", x: 140, y: 480, w: 220, h: 180, hours: "7:00 AM - 8:30 PM", capacity: "50 Seats", desc: "Air-conditioned multimedia lecture classroom." },
    { id: "r205", code: "205", name: "Lecture Classroom 205", category: "Classroom", floor: 2, color: "#10b981", x: 400, y: 480, w: 220, h: 180, hours: "7:00 AM - 8:30 PM", capacity: "50 Seats", desc: "Air-conditioned multimedia lecture classroom." }
  ],
  3: [
    { id: "r301", code: "301", name: "Main University Library & Archives", category: "Facility", floor: 3, color: "#8b5cf6", x: 140, y: 120, w: 460, h: 200, hours: "7:30 AM - 6:30 PM", capacity: "200 Readers", desc: "Main book collections, quiet reading rooms, research catalog, and thesis archive section." },
    { id: "r302", code: "302", name: "E-Library & Digital Research Hub", category: "Laboratory", floor: 3, color: "#f5ab16", x: 640, y: 120, w: 300, h: 200, hours: "7:30 AM - 6:00 PM", capacity: "60 PCs", desc: "Computers equipped with access to digital journals, IEEE, and online academic databases." },
    { id: "r303", code: "303", name: "CEAS Teacher Education Room 303", category: "Classroom", floor: 3, color: "#10b981", x: 140, y: 480, w: 240, h: 180, hours: "7:00 AM - 8:30 PM", capacity: "45 Seats", desc: "College of Education Arts & Sciences demo teaching room." }
  ],
  4: [
    { id: "r401", code: "401", name: "CBA Business Simulation Room", category: "Laboratory", floor: 4, color: "#f5ab16", x: 140, y: 120, w: 280, h: 180, hours: "8:00 AM - 6:00 PM", capacity: "40 Workstations", desc: "College of Business & Accountancy mock trading and corporate operations room." },
    { id: "r402", code: "402", name: "Lecture Classroom 402", category: "Classroom", floor: 4, color: "#10b981", x: 460, y: 120, w: 220, h: 180, hours: "7:00 AM - 8:30 PM", capacity: "50 Seats", desc: "Standard academic lecture hall." },
    { id: "r403", code: "403", name: "Lecture Classroom 403", category: "Classroom", floor: 4, color: "#10b981", x: 720, y: 120, w: 220, h: 180, hours: "7:00 AM - 8:30 PM", capacity: "50 Seats", desc: "Standard academic lecture hall." }
  ],
  5: [
    { id: "r501", code: "501", name: "Allied Health Nursing Skill Lab", category: "Laboratory", floor: 5, color: "#06b6d4", x: 140, y: 120, w: 320, h: 200, hours: "8:00 AM - 5:00 PM", capacity: "30 Training Beds", desc: "Mock hospital ward, anatomical manikins, and clinical assessment station." },
    { id: "r502", code: "502", name: "Anatomy & Physiology Science Lab", category: "Laboratory", floor: 5, color: "#06b6d4", x: 500, y: 120, w: 300, h: 200, hours: "8:00 AM - 5:00 PM", capacity: "40 Workstations", desc: "Microscopes, specimen models, and biological research benches." }
  ],
  6: [
    { id: "r601", code: "601", name: "GC Grand University Auditorium", category: "Facility", floor: 6, color: "#8b5cf6", x: 140, y: 120, w: 500, h: 300, hours: "As Scheduled", capacity: "500 Seats", desc: "Main event venue for commencement, conferences, symposia, and theatrical performances." },
    { id: "r602", code: "602", name: "Audio-Visual Performance Room", category: "Facility", floor: 6, color: "#ec4899", x: 680, y: 120, w: 280, h: 200, hours: "8:00 AM - 6:00 PM", capacity: "80 Seats", desc: "Acoustically insulated hall with projection and sound mixing equipment." }
  ]
};

const CATEGORIES = ["All", "Classroom", "Laboratory", "Office", "Student Services", "Facility"];

/**
 * INITIALIZATION ON DOM READY
 */
document.addEventListener("DOMContentLoaded", () => {
  loadInitialRooms();
  renderFloorSelector();
  renderCategoryPills();
  renderApp();
  setupEventListeners();
  setupSvgPanAndZoom();
});

function loadInitialRooms() {
  // Deep clone presets into state
  state.rooms = JSON.parse(JSON.stringify(PRESET_ROOMS));
}

/**
 * CORE RENDERING PIPELINE
 */
function renderApp() {
  renderDirectoryList();
  renderSvgBlueprint();
  updateHeaderAndBadges();
}

function renderFloorSelector() {
  const container = document.getElementById("floorSelectorButtons");
  if (!container) return;

  container.innerHTML = "";
  for (let f = 1; f <= 6; f++) {
    const btn = document.createElement("button");
    btn.className = `floor-btn py-1.5 rounded-lg border text-xs font-bold transition flex flex-col items-center justify-center ${
      state.currentFloor === f
        ? "active bg-gc-green text-white border-gc-gold dark:bg-gc-gold dark:text-slate-900"
        : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100"
    }`;
    btn.innerHTML = `<span>F${f}</span>`;
    btn.onclick = () => switchFloor(f);
    container.appendChild(btn);
  }
}

function renderCategoryPills() {
  const container = document.getElementById("categoryPills");
  if (!container) return;

  container.innerHTML = "";
  CATEGORIES.forEach(cat => {
    const btn = document.createElement("button");
    const isActive = state.activeCategory === cat;
    btn.className = `category-pill px-3 py-1 rounded-full border text-xs font-semibold ${
      isActive
        ? "active"
        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200"
    }`;
    btn.textContent = cat;
    btn.onclick = () => {
      state.activeCategory = cat;
      renderCategoryPills();
      renderApp();
    };
    container.appendChild(btn);
  });
}

function getFilteredRoomsForCurrentFloor() {
  const floorRooms = state.rooms[state.currentFloor] || [];
  return floorRooms.filter(room => {
    const matchesCat = state.activeCategory === "All" || room.category === state.activeCategory;
    const query = state.searchQuery.toLowerCase().trim();
    const matchesSearch = !query || 
      room.name.toLowerCase().includes(query) || 
      room.code.toLowerCase().includes(query) ||
      room.category.toLowerCase().includes(query);
    return matchesCat && matchesSearch;
  }).sort((a, b) => {
    if (state.sortBy === "name") return a.name.localeCompare(b.name);
    if (state.sortBy === "category") return a.category.localeCompare(b.category);
    return a.code.localeCompare(b.code, undefined, { numeric: true });
  });
}

function renderDirectoryList() {
  const grid = document.getElementById("directoryGrid");
  const countLabel = document.getElementById("roomCountLabel");
  const filterLabel = document.getElementById("activeFilterLabel");
  if (!grid) return;

  const rooms = getFilteredRoomsForCurrentFloor();
  
  if (countLabel) countLabel.textContent = `${rooms.length} Rooms`;
  if (filterLabel) filterLabel.textContent = `on Floor ${state.currentFloor} (${state.activeCategory})`;

  if (rooms.length === 0) {
    grid.innerHTML = `
      <div class="p-8 text-center text-slate-400 dark:text-slate-500">
        <i class="fa-solid fa-folder-open text-3xl mb-2"></i>
        <p class="text-xs font-semibold">No rooms found on Floor ${state.currentFloor}</p>
        <p class="text-[11px] mt-1">Try resetting search filters or switch floors.</p>
      </div>`;
    return;
  }

  grid.innerHTML = rooms.map(r => `
    <div onclick="selectRoom('${r.id}')" class="directory-card p-3 rounded-xl border ${
      state.selectedRoomId === r.id 
        ? "border-gc-gold bg-amber-500/10 dark:bg-gc-gold/10 shadow-sm" 
        : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-gc-green"
    } cursor-pointer flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <div class="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs text-white shadow-xs" style="background-color: ${r.color || '#0a5c36'}">
          ${r.code}
        </div>
        <div>
          <h4 class="font-bold text-xs text-slate-900 dark:text-white leading-snug">${r.name}</h4>
          <span class="text-[10px] text-slate-500 dark:text-slate-400 font-medium">${r.category} • Floor ${r.floor}</span>
        </div>
      </div>
      <div class="flex items-center space-x-1">
        ${state.isEditMode ? `
          <button onclick="event.stopPropagation(); openRoomEditModal('${r.id}')" class="p-1.5 text-slate-400 hover:text-gc-green dark:hover:text-gc-gold text-xs">
            <i class="fa-solid fa-pen"></i>
          </button>` : ''
        }
        <i class="fa-solid fa-chevron-right text-slate-300 dark:text-slate-600 text-xs ml-1"></i>
      </div>
    </div>
  `).join("");
}

function renderSvgBlueprint() {
  const shapesGroup = document.getElementById("buildingShapesGroup");
  const pinsGroup = document.getElementById("buildingPinsGroup");
  const entranceGraphic = document.getElementById("mainEntranceGraphic");
  if (!shapesGroup || !pinsGroup) return;

  shapesGroup.innerHTML = "";
  pinsGroup.innerHTML = "";

  // Show Main Entrance graphic only on Floor 1
  if (entranceGraphic) {
    entranceGraphic.style.display = state.currentFloor === 1 ? "block" : "none";
  }

  const rooms = state.rooms[state.currentFloor] || [];

  rooms.forEach(r => {
    const isSelected = state.selectedRoomId === r.id;
    const isFiltered = (state.activeCategory === "All" || r.category === state.activeCategory) &&
      (!state.searchQuery || r.name.toLowerCase().includes(state.searchQuery.toLowerCase()) || r.code.toLowerCase().includes(state.searchQuery.toLowerCase()));

    // Create Room Geometry Rect
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", r.x);
    rect.setAttribute("y", r.y);
    rect.setAttribute("width", r.w);
    rect.setAttribute("height", r.h);
    rect.setAttribute("rx", "10");
    rect.setAttribute("fill", r.color || "#0a5c36");
    rect.setAttribute("fill-opacity", isFiltered ? (isSelected ? "0.9" : "0.7") : "0.2");
    rect.setAttribute("stroke", isSelected ? "#f5ab16" : (r.color || "#0a5c36"));
    rect.setAttribute("stroke-width", isSelected ? "4" : "2");
    rect.setAttribute("class", `room-rect ${isSelected ? 'room-selected' : ''}`);
    rect.onclick = (e) => {
      e.stopPropagation();
      selectRoom(r.id);
    };
    shapesGroup.appendChild(rect);

    // Create Text Label Pin
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("transform", `translate(${r.x + r.w / 2}, ${r.y + r.h / 2})`);
    g.style.pointerEvents = "none";

    const textCode = document.createElementNS("http://www.w3.org/2000/svg", "text");
    textCode.setAttribute("y", "-4");
    textCode.setAttribute("fill", "#ffffff");
    textCode.setAttribute("font-size", "14");
    textCode.setAttribute("font-weight", "bold");
    textCode.setAttribute("text-anchor", "middle");
    textCode.setAttribute("class", "room-label-text");
    textCode.textContent = r.code;

    const textName = document.createElementNS("http://www.w3.org/2000/svg", "text");
    textName.setAttribute("y", "14");
    textName.setAttribute("fill", "#ffffff");
    textName.setAttribute("font-size", "10");
    textName.setAttribute("font-weight", "500");
    textName.setAttribute("text-anchor", "middle");
    textName.setAttribute("opacity", "0.9");
    textName.setAttribute("class", "room-label-text");

    // Truncate name for small room rects
    const maxChars = Math.floor(r.w / 9);
    textName.textContent = r.name.length > maxChars ? r.name.substring(0, maxChars) + "…" : r.name;

    g.appendChild(textCode);
    g.appendChild(textName);
    pinsGroup.appendChild(g);
  });
}

function updateHeaderAndBadges() {
  const currentFloorBadge = document.getElementById("currentFloorBadge");
  const currentFloorLegendBadge = document.getElementById("currentFloorLegendBadge");
  if (currentFloorBadge) currentFloorBadge.textContent = `Floor ${state.currentFloor} Selected`;
  if (currentFloorLegendBadge) currentFloorLegendBadge.textContent = `F${state.currentFloor}`;
}

/**
 * INTERACTION HANDLERS
 */
function switchFloor(floorNum) {
  state.currentFloor = parseInt(floorNum);
  renderFloorSelector();
  renderApp();
  if (state.activeRoute) {
    renderWayfindingRoute();
  }
}

function selectRoom(roomId) {
  state.selectedRoomId = roomId;
  renderDirectoryList();
  renderSvgBlueprint();

  // Find room across all floors
  let foundRoom = null;
  for (let f = 1; f <= 6; f++) {
    const r = (state.rooms[f] || []).find(item => item.id === roomId);
    if (r) {
      foundRoom = r;
      break;
    }
  }

  if (foundRoom) {
    if (foundRoom.floor !== state.currentFloor) {
      switchFloor(foundRoom.floor);
    }
    openDetailDrawer(foundRoom);
  }
}

/**
 * ROOM DETAIL DRAWER HANDLERS
 */
function openDetailDrawer(room) {
  const drawer = document.getElementById("detailDrawer");
  if (!drawer) return;

  document.getElementById("drawerTitle").textContent = room.name;
  document.getElementById("drawerCode").textContent = `CODE: R-${room.code} • Gordon College`;
  document.getElementById("drawerCategoryBadge").textContent = room.category;
  document.getElementById("drawerFloorBadge").textContent = `Floor ${room.floor}`;
  document.getElementById("drawerHours").textContent = room.hours || "7:00 AM - 7:00 PM";
  document.getElementById("drawerCapacity").textContent = room.capacity || "N/A";
  document.getElementById("drawerDescription").textContent = room.desc || "No description provided.";

  // Set up directions button inside drawer
  const directionsBtn = document.getElementById("drawerDirectionsBtn");
  if (directionsBtn) {
    directionsBtn.onclick = () => {
      closeDetailDrawer();
      openWayfinderModal(room.id);
    };
  }

  // Set up edit button inside drawer
  const editBtn = document.getElementById("drawerEditBtn");
  if (editBtn) {
    editBtn.onclick = () => {
      closeDetailDrawer();
      openRoomEditModal(room.id);
    };
  }

  drawer.classList.remove("translate-x-full");
}

function closeDetailDrawer() {
  const drawer = document.getElementById("detailDrawer");
  if (drawer) drawer.classList.add("translate-x-full");
}

/**
 * DESIGN / ADMIN EDIT MODE HANDLERS
 */
function toggleEditMode() {
  state.isEditMode = !state.isEditMode;
  const adminToolbar = document.getElementById("adminToolbar");
  const editBadge = document.getElementById("editBadge");

  if (adminToolbar) {
    adminToolbar.classList.toggle("hidden", !state.isEditMode);
  }
  if (editBadge) {
    editBadge.classList.toggle("hidden", !state.isEditMode);
  }
  renderDirectoryList();
}

function openRoomEditModal(roomId = null) {
  const modal = document.getElementById("roomEditModal");
  const form = document.getElementById("roomEditForm");
  const headerTitle = document.getElementById("editModalHeaderTitle");
  const deleteBtn = document.getElementById("deleteRoomBtn");
  if (!modal || !form) return;

  if (roomId) {
    // Editing Existing Room
    let roomToEdit = null;
    for (let f = 1; f <= 6; f++) {
      const r = (state.rooms[f] || []).find(item => item.id === roomId);
      if (r) { roomToEdit = r; break; }
    }

    if (roomToEdit) {
      if (headerTitle) headerTitle.textContent = "Customize Room";
      document.getElementById("editRoomId").value = roomToEdit.id;
      document.getElementById("editRoomCode").value = roomToEdit.code;
      document.getElementById("editRoomFloor").value = roomToEdit.floor;
      document.getElementById("editRoomName").value = roomToEdit.name;
      document.getElementById("editRoomCategory").value = roomToEdit.category;
      document.getElementById("editRoomColor").value = roomToEdit.color || "#0a5c36";
      document.getElementById("editRoomX").value = roomToEdit.x;
      document.getElementById("editRoomY").value = roomToEdit.y;
      document.getElementById("editRoomW").value = roomToEdit.w;
      document.getElementById("editRoomH").value = roomToEdit.h;
      document.getElementById("editRoomDesc").value = roomToEdit.desc || "";
      if (deleteBtn) deleteBtn.style.display = "block";
    }
  } else {
    // Adding New Room
    if (headerTitle) headerTitle.textContent = "Add New Room";
    form.reset();
    document.getElementById("editRoomId").value = "";
    document.getElementById("editRoomFloor").value = state.currentFloor;
    document.getElementById("editRoomColor").value = "#0a5c36";
    document.getElementById("editRoomX").value = 140;
    document.getElementById("editRoomY").value = 120;
    document.getElementById("editRoomW").value = 200;
    document.getElementById("editRoomH").value = 160;
    if (deleteBtn) deleteBtn.style.display = "none";
  }

  modal.classList.remove("hidden");
}

function closeRoomEditModal() {
  const modal = document.getElementById("roomEditModal");
  if (modal) modal.classList.add("hidden");
}

function handleRoomFormSubmit(e) {
  e.preventDefault();
  const idInput = document.getElementById("editRoomId").value;
  const floor = parseInt(document.getElementById("editRoomFloor").value);
  const code = document.getElementById("editRoomCode").value;
  const name = document.getElementById("editRoomName").value;
  const category = document.getElementById("editRoomCategory").value;
  const color = document.getElementById("editRoomColor").value;
  const x = parseInt(document.getElementById("editRoomX").value) || 140;
  const y = parseInt(document.getElementById("editRoomY").value) || 120;
  const w = parseInt(document.getElementById("editRoomW").value) || 200;
  const h = parseInt(document.getElementById("editRoomH").value) || 160;
  const desc = document.getElementById("editRoomDesc").value;

  const roomId = idInput || `r_${Date.now()}`;

  const roomObj = {
    id: roomId,
    code,
    name,
    category,
    floor,
    color,
    x, y, w, h,
    hours: "7:00 AM - 7:00 PM",
    capacity: "40 Students",
    desc
  };

  // Remove room from old floor if present
  for (let f = 1; f <= 6; f++) {
    state.rooms[f] = (state.rooms[f] || []).filter(r => r.id !== roomId);
  }

  // Add room to target floor
  if (!state.rooms[floor]) state.rooms[floor] = [];
  state.rooms[floor].push(roomObj);

  closeRoomEditModal();
  switchFloor(floor);
}

function deleteCurrentEditingRoom() {
  const roomId = document.getElementById("editRoomId").value;
  if (!roomId) return;

  for (let f = 1; f <= 6; f++) {
    state.rooms[f] = (state.rooms[f] || []).filter(r => r.id !== roomId);
  }

  closeRoomEditModal();
  renderApp();
}

/**
 * INTER-FLOOR WAYFINDING ROUTE LOGIC
 */
function openWayfinderModal(preselectEndId = null) {
  const modal = document.getElementById("wayfinderModal");
  const startSelect = document.getElementById("routeStartSelect");
  const endSelect = document.getElementById("routeEndSelect");
  if (!modal || !startSelect || !endSelect) return;

  // Flatten all rooms across 6 floors into select options
  let allRooms = [];
  for (let f = 1; f <= 6; f++) {
    (state.rooms[f] || []).forEach(r => {
      allRooms.push({ id: r.id, name: `Floor ${r.floor}: ${r.code} - ${r.name}` });
    });
  }

  const optionsHtml = allRooms.map(r => `<option value="${r.id}">${r.name}</option>`).join("");
  startSelect.innerHTML = `<option value="ENTRANCE">📍 Floor 1: Main Entrance Gate</option>` + optionsHtml;
  endSelect.innerHTML = optionsHtml;

  if (preselectEndId) {
    endSelect.value = preselectEndId;
  }

  modal.classList.remove("hidden");
}

function closeWayfinderModal() {
  const modal = document.getElementById("wayfinderModal");
  if (modal) modal.classList.add("hidden");
}

function calculateAndDrawRoute() {
  const startVal = document.getElementById("routeStartSelect").value;
  const endVal = document.getElementById("routeEndSelect").value;
  
  if (!endVal || startVal === endVal) {
    alert("Please select two distinct points for directions.");
    return;
  }

  closeWayfinderModal();

  // Retrieve origin & destination rooms
  let startRoom = null;
  let endRoom = null;

  if (startVal === "ENTRANCE") {
    startRoom = { id: "ENTRANCE", floor: 1, x: 600, y: 700, code: "Main Gate", name: "Main Entrance" };
  }

  for (let f = 1; f <= 6; f++) {
    (state.rooms[f] || []).forEach(r => {
      if (r.id === startVal) startRoom = r;
      if (r.id === endVal) endRoom = r;
    });
  }

  if (!endRoom) return;

  state.activeRoute = { start: startRoom, end: endRoom };
  switchFloor(endRoom.floor);
  renderWayfindingRoute();
}

function renderWayfindingRoute() {
  const pathElem = document.getElementById("activeRoutePath");
  const routeSummaryBar = document.getElementById("routeSummaryBar");
  const endpointsElem = document.getElementById("routeEndpoints");
  const floorNotice = document.getElementById("routeFloorNotice");
  if (!pathElem || !state.activeRoute) return;

  const { start, end } = state.activeRoute;
  const isSameFloor = start.floor === end.floor;

  let dPath = "";
  if (isSameFloor && start.floor === state.currentFloor) {
    const startX = start.x + (start.w || 0) / 2;
    const startY = start.y + (start.h || 0) / 2;
    const endX = end.x + end.w / 2;
    const endY = end.y + end.h / 2;

    // Draw route along corridor center (Y=400)
    dPath = `M ${startX} ${startY} L ${startX} 400 L ${endX} 400 L ${endX} ${endY}`;
    if (floorNotice) floorNotice.textContent = `Direct Floor ${start.floor} Path`;
  } else if (state.currentFloor === end.floor) {
    // Route from Elevator A (170, 400) to Destination
    const endX = end.x + end.w / 2;
    const endY = end.y + end.h / 2;
    dPath = `M 170 400 L ${endX} 400 L ${endX} ${endY}`;
    if (floorNotice) floorNotice.textContent = `Arriving via Elevator A (Floor ${start.floor} → ${end.floor})`;
  } else {
    pathElem.setAttribute("d", "");
    if (routeSummaryBar) routeSummaryBar.classList.add("hidden");
    return;
  }

  pathElem.setAttribute("d", dPath);
  if (endpointsElem) {
    endpointsElem.textContent = `From ${start.name} to ${end.name}`;
  }
  if (routeSummaryBar) {
    routeSummaryBar.classList.remove("hidden");
  }
}

function clearRoute() {
  state.activeRoute = null;
  const pathElem = document.getElementById("activeRoutePath");
  const routeSummaryBar = document.getElementById("routeSummaryBar");
  if (pathElem) pathElem.setAttribute("d", "");
  if (routeSummaryBar) routeSummaryBar.classList.add("hidden");
}

/**
 * JSON SCHEMA IMPORT / EXPORT MODAL
 */
function openSchemaJsonModal() {
  const modal = document.getElementById("jsonSchemaModal");
  const textarea = document.getElementById("jsonArea");
  if (!modal || !textarea) return;

  textarea.value = JSON.stringify(state.rooms, null, 2);
  modal.classList.remove("hidden");
}

function closeSchemaJsonModal() {
  const modal = document.getElementById("jsonSchemaModal");
  if (modal) modal.classList.add("hidden");
}

function applyJsonImport() {
  const textarea = document.getElementById("jsonArea");
  if (!textarea) return;

  try {
    const parsed = JSON.parse(textarea.value);
    state.rooms = parsed;
    closeSchemaJsonModal();
    renderApp();
    alert("Floor blueprint JSON successfully applied!");
  } catch (err) {
    alert("Invalid JSON format. Please check syntax.");
  }
}

/**
 * PAN AND ZOOM ENGINE FOR SVG MAP CANVAS
 */
function setupSvgPanAndZoom() {
  const viewport = document.getElementById("mapViewport");
  const svg = document.getElementById("campusSvg");
  if (!viewport || !svg) return;

  viewport.addEventListener("mousedown", (e) => {
    if (e.target.closest(".room-rect")) return;
    state.isDragging = true;
    state.dragStartX = e.clientX - state.panX;
    state.dragStartY = e.clientY - state.panY;
  });

  window.addEventListener("mousemove", (e) => {
    if (!state.isDragging) return;
    state.panX = e.clientX - state.dragStartX;
    state.panY = e.clientY - state.dragStartY;
    updateSvgTransform();
  });

  window.addEventListener("mouseup", () => {
    state.isDragging = false;
  });

  viewport.addEventListener("wheel", (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    zoomMap(zoomFactor);
  }, { passive: false });
}

function zoomMap(factor) {
  state.zoom = Math.min(Math.max(0.6, state.zoom * factor), 3.0);
  updateSvgTransform();
}

function resetMapTransform() {
  state.zoom = 1;
  state.panX = 0;
  state.panY = 0;
  updateSvgTransform();
}

function updateSvgTransform() {
  const svg = document.getElementById("campusSvg");
  if (svg) {
    svg.style.transform = `translate(${state.panX}px, ${state.panY}px) scale(${state.zoom})`;
  }
}

/**
 * VIEWPORT & TOGGLE SWITCHERS
 */
function switchViewMode(mode) {
  state.viewMode = mode;
  const listPanel = document.getElementById("listPanel");
  const mapPanel = document.getElementById("mapPanel");

  if (mode === "map") {
    if (listPanel) listPanel.classList.add("hidden");
    if (mapPanel) mapPanel.classList.remove("hidden");
  } else if (mode === "list") {
    if (listPanel) listPanel.classList.remove("hidden", "md:w-1/2", "lg:w-5/12");
    if (listPanel) listPanel.classList.add("w-full");
    if (mapPanel) mapPanel.classList.add("hidden");
  } else {
    // Split view
    if (listPanel) {
      listPanel.classList.remove("hidden", "w-full");
      listPanel.classList.add("md:w-1/2", "lg:w-5/12");
    }
    if (mapPanel) mapPanel.classList.remove("hidden");
  }
}

/**
 * GLOBAL EVENT LISTENERS BINDING
 */
function setupEventListeners() {
  // Brand Logo Click resets views
  const brand = document.getElementById("brandLogo");
  if (brand) brand.onclick = () => { resetMapTransform(); clearRoute(); };

  // Search Bar logic
  const searchInput = document.getElementById("searchInput");
  const clearSearch = document.getElementById("clearSearch");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      state.searchQuery = e.target.value;
      if (clearSearch) clearSearch.classList.toggle("hidden", !state.searchQuery);
      renderApp();
    });
  }
  if (clearSearch) {
    clearSearch.onclick = () => {
      if (searchInput) searchInput.value = "";
      state.searchQuery = "";
      clearSearch.classList.add("hidden");
      renderApp();
    };
  }

  // Edit Mode toggle
  const toggleEditBtn = document.getElementById("toggleEditModeBtn");
  if (toggleEditBtn) toggleEditBtn.onclick = toggleEditMode;

  // Admin Toolbar buttons
  const addBtn = document.getElementById("addNewRoomBtn");
  if (addBtn) addBtn.onclick = () => openRoomEditModal();

  const presetBtn = document.getElementById("loadPresetBtn");
  if (presetBtn) presetBtn.onclick = () => { loadInitialRooms(); renderApp(); };

  const clearFloorBtn = document.getElementById("clearAllRoomsBtn");
  if (clearFloorBtn) clearFloorBtn.onclick = () => { state.rooms[state.currentFloor] = []; renderApp(); };

  const jsonBtn = document.getElementById("openSchemaJsonBtn");
  if (jsonBtn) jsonBtn.onclick = openSchemaJsonModal;

  // View Switcher Buttons
  const viewSplit = document.getElementById("viewSplitBtn");
  const viewMap = document.getElementById("viewMapBtn");
  const viewList = document.getElementById("viewListBtn");
  if (viewSplit) viewSplit.onclick = () => switchViewMode("split");
  if (viewMap) viewMap.onclick = () => switchViewMode("map");
  if (viewList) viewList.onclick = () => switchViewMode("list");

  // Mobile Bottom Nav
  const mobMap = document.getElementById("mobNavMap");
  const mobList = document.getElementById("mobNavList");
  const mobRoute = document.getElementById("mobNavRoute");
  if (mobMap) mobMap.onclick = () => switchViewMode("map");
  if (mobList) mobList.onclick = () => switchViewMode("list");
  if (mobRoute) mobRoute.onclick = () => openWayfinderModal();

  // Wayfinder Modals
  const wayfinderBtn = document.getElementById("openWayfinderBtn");
  const closeWayfinderBtn = document.getElementById("closeWayfinderBtn");
  const calculateRouteBtn = document.getElementById("calculateRouteBtn");
  const cancelRouteBtn = document.getElementById("cancelRouteBtn");
  if (wayfinderBtn) wayfinderBtn.onclick = () => openWayfinderModal();
  if (closeWayfinderBtn) closeWayfinderBtn.onclick = closeWayfinderModal;
  if (cancelRouteBtn) cancelRouteBtn.onclick = closeWayfinderModal;
  if (calculateRouteBtn) calculateRouteBtn.onclick = calculateAndDrawRoute;

  // Clear Route button
  const clearRouteBtn = document.getElementById("clearRouteBtn");
  if (clearRouteBtn) clearRouteBtn.onclick = clearRoute;

  // Zoom controls
  const zoomIn = document.getElementById("zoomInBtn");
  const zoomOut = document.getElementById("zoomOutBtn");
  const resetView = document.getElementById("resetViewBtn");
  if (zoomIn) zoomIn.onclick = () => zoomMap(1.2);
  if (zoomOut) zoomOut.onclick = () => zoomMap(0.8);
  if (resetView) resetView.onclick = resetMapTransform;

  // Detail Drawer close
  const closeDrawerBtn = document.getElementById("closeDrawerBtn");
  if (closeDrawerBtn) closeDrawerBtn.onclick = closeDetailDrawer;

  // Room Edit Modal Form
  const roomEditForm = document.getElementById("roomEditForm");
  const closeRoomEditModalBtn = document.getElementById("closeRoomEditModalBtn");
  const cancelEditRoomBtn = document.getElementById("cancelEditRoomBtn");
  const deleteRoomBtn = document.getElementById("deleteRoomBtn");
  if (roomEditForm) roomEditForm.onsubmit = handleRoomFormSubmit;
  if (closeRoomEditModalBtn) closeRoomEditModalBtn.onclick = closeRoomEditModal;
  if (cancelEditRoomBtn) cancelEditRoomBtn.onclick = closeRoomEditModal;
  if (deleteRoomBtn) deleteRoomBtn.onclick = deleteCurrentEditingRoom;

  // JSON Schema Modal
  const closeJsonModalBtn = document.getElementById("closeJsonModalBtn");
  const applyJsonBtn = document.getElementById("applyJsonBtn");
  const copyJsonBtn = document.getElementById("copyJsonBtn");
  const downloadJsonBtn = document.getElementById("downloadJsonBtn");
  if (closeJsonModalBtn) closeJsonModalBtn.onclick = closeSchemaJsonModal;
  if (applyJsonBtn) applyJsonBtn.onclick = applyJsonImport;
  if (copyJsonBtn) {
    copyJsonBtn.onclick = () => {
      const textarea = document.getElementById("jsonArea");
      textarea.select();
      navigator.clipboard.writeText(textarea.value);
      alert("JSON copied to clipboard!");
    };
  }
  if (downloadJsonBtn) {
    downloadJsonBtn.onclick = () => {
      const textarea = document.getElementById("jsonArea");
      const blob = new Blob([textarea.value], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `Gordon_College_Floor_Layout.json`;
      a.click();
    };
  }

  // Dark Mode Toggle
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  if (themeToggleBtn) {
    themeToggleBtn.onclick = () => {
      document.documentElement.classList.toggle("dark");
    };
  }
}
