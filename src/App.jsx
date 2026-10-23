
import React, { useState } from "react";
import {
  LayoutDashboard, Users, CalendarCheck, ClipboardList,
  Building2, ChartNoAxesColumn, Settings, Search, Bell,
  Moon, Sun, Plus, Plane, FileText, Cake, Zap,
  ChevronRight, MoreHorizontal, ArrowUpDown
} from "lucide-react";
import "./App.css";

const initialEmployees = [
  ["Tata Shalini", "Engineering", "Active"],
  ["Bhavani Kishore Bhukya", "Engineering", "Active"],
  ["Jyothirmai Chandolu", "Data & Analytics", "Active"],
  ["Swathi Kaviti", "Operations", "On Leave"],
  ["Sireesha Bavirthi", "HR", "Active"],
  ["Akshaya Palogani", "Marketing", "Active"],
  ["Meghana Rayabagi", "Design", "Active"],
  ["Pathivada Ranjith Kumar", "Engineering", "Active"],
  ["Natakarani Venkata Siddhardha", "Engineering", "Active"],
  ["Dodda Usha Sri", "Finance", "Active"],
];

const departments = [
  ["Engineering", 26, "#5969a8"],
  ["Data & Analytics", 16, "#858ce8"],
  ["Operations", 11, "#ff9b38"],
  ["HR", 11, "#d9a98c"],
  ["Finance", 11, "#b4b4dc"],
  ["Marketing", 11, "#a9c4e2"],
  ["Design", 11, "#b6b7c6"],
  ["Others", 13, "#c5a18e"],
];

function Avatar({ name }) {
  return <div className="avatar">{name.split(" ").map(w => w[0]).slice(0, 2).join("")}</div>;
}

function Panel({ title, icon: Icon, children, action = "View all" }) {
  return (
    <section className="panel">
      <div className="panel-heading">
        <h3>{Icon && <Icon size={20} />} {title}</h3>
        <button className="outline-btn">{action}</button>
      </div>
      {children}
    </section>
  );
}

export default function App() {
  const [active, setActive] = useState("Dashboard");
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("All Departments");
  const [status, setStatus] = useState("All Status");
  const [dark, setDark] = useState(false);
  const [employees, setEmployees] = useState(initialEmployees);

  const filtered = employees.filter(([name, dept, state]) =>
    name.toLowerCase().includes(query.toLowerCase()) &&
    (department === "All Departments" || dept === department) &&
    (status === "All Status" || state === status)
  );

  return (
    <div className={`app ${dark ? "dark" : ""}`}>
      <aside className="sidebar">
        
        <p className="tagline">Innovate. Engineer. Transform.</p>
        <nav>
          {[
            [LayoutDashboard, "Dashboard"], [Users, "Employees"],
            [CalendarCheck, "Attendance"], [ClipboardList, "Leave Requests"],
            [Building2, "Departments"], [ChartNoAxesColumn, "Analytics"],
            [Settings, "Settings"]
          ].map(([Icon, label]) => (
            <button key={label} className={`nav-item ${active === label ? "selected" : ""}`} onClick={() => setActive(label)}>
              <Icon size={19}/><span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="profile"><Avatar name="Omendra Singh"/><div><b>Omendra Singh</b><small>HR Admin</small><small className="online">● Online</small></div><ChevronRight size={17}/></div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="global-search"><Search size={21}/><input placeholder="Search employees, departments, or anything..." value={query} onChange={e => setQuery(e.target.value)}/><kbd>⌘ K</kbd></div>
          <button className="icon-btn" aria-label="Notifications"><Bell size={20}/><i/></button>
          <button className="icon-btn" onClick={() => setDark(!dark)} aria-label="Toggle theme">{dark ? <Sun size={20}/> : <Moon size={20}/>}</button>
          <div className="date-card"><b>Fri, 23 Oct 2026</b><span>Have a productive day!</span></div>
        </header>

        <div className="dashboard-grid">
          <div className="center-column">
            <section className="hero">
              <div className="hero-content">
                <h1>Good morning, Omendra <Sun className="sun" size={29}/></h1>
                <p>Let's build a stronger workplace together.</p>
                <div className="motto"><div><span>INNOVATE.</span><small>Better People</small></div><div><span>ENGINEER.</span><small>Better Teams</small></div><div><span>TRANSFORM.</span><small>A Brighter Tomorrow</small></div></div>
              </div>
            </section>

            <section className="stats-grid">
              {[
                ["Total Employees", 19, Users, "purple", "Across all departments"],
                ["Present Today", 16, CalendarCheck, "green", "Out of 19"],
                ["On Leave", 3, Plane, "orange", "View leave calendar →"],
                ["Pending Requests", 2, FileText, "blue", "Needs your approval →"]
              ].map(([title, value, Icon, color, note]) => (
                <article className="stat-card" key={title}>
                  <div className={`stat-icon ${color}`}><Icon size={24}/></div>
                  <div className="stat-info"><span>{title}</span><div className="stat-number">{value}</div><small className="muted">{note}</small></div>
                </article>
              ))}
            </section>

            <section className="employee-panel">
              <div className="employee-heading"><div><h2>{active === "Dashboard" ? "Employees" : active}</h2><p>Manage your team, view details, and take action.</p></div><button className="primary-btn" onClick={() => {const name = prompt("Enter employee name"); if(name?.trim()) setEmployees(old => [...old, [name.trim(), "Others", "Active"]]);}}><Plus size={18}/> Add Employee</button></div>
              <div className="filters">
                <div className="table-search"><Search size={17}/><input placeholder="Search by name..." value={query} onChange={e => setQuery(e.target.value)}/></div>
                <select value={department} onChange={e => setDepartment(e.target.value)}><option>All Departments</option>{departments.map(([name]) => <option key={name}>{name}</option>)}</select>
                <select value={status} onChange={e => setStatus(e.target.value)}><option>All Status</option><option>Active</option><option>On Leave</option></select>
                <button className="sort-btn" onClick={() => setEmployees(old => [...old].reverse())}><ArrowUpDown size={14}/> Sort</button>
              </div>
              <div className="table-wrap"><table>
                <thead><tr><th>#</th><th>Name</th><th>Department</th><th>Role</th><th>Status</th><th>Joining Date</th><th>Actions</th></tr></thead>
                <tbody>{filtered.map(([name, dept, state], i) => <tr key={name}><td>{i+1}</td><td><div className="employee-name"><Avatar name={name}/>{name}</div></td><td className="muted">{dept}</td><td className="muted">—</td><td><span className={`status ${state === "Active" ? "active" : "leave"}`}>● &nbsp;{state}</span></td><td className="muted">—</td><td><button className="more-btn" onClick={() => {if(confirm(`Remove ${name} from this demo?`)) setEmployees(old => old.filter(e => e[0] !== name));}}><MoreHorizontal size={18}/></button></td></tr>)}
                {filtered.length === 0 && <tr><td colSpan="7" className="empty">No matching employees found.</td></tr>}</tbody>
              </table></div>
              <div className="pagination"><span>Showing {filtered.length} employees</span><span>Page 1</span></div>
            </section>
          </div>

          <aside className="right-column">
            <Panel title="Department Overview" icon={Building2} action="›">
              <div className="department-content"><div className="donut"><div><b>19</b><span>Employees</span></div></div><div className="legend">{departments.map(([name, percent, color]) => <div key={name}><i style={{background:color}}/><span>{name}</span><b>{percent}%</b></div>)}</div></div>
            </Panel>
            <Panel title="Upcoming Birthdays" icon={Cake}>
              <div className="activity-list">{[["Omendra Singh","12 May",25],["Swathi Kaviti","3 Jun",26],["Meghana Rayabagi","18 Jun",27],["Gidituri Harika","25 Jun",26]].map(([name,date,age]) => <div className="birthday-row" key={name}><Avatar name={name}/><div className="activity-text"><b>{name}</b><span>{date}</span></div><small>Turns {age}</small></div>)}</div>
            </Panel>
            <Panel title="Recent Activity" icon={Zap}>
              <div className="activity-list">{[["Tata Shalini","Updated profile details","2 hours ago"],["Omendra Singh","Marked attendance","4 hours ago"],["Katru Ramya Sri","Submitted leave request","6 hours ago"],["Akshaya Palogani","Updated profile details","8 hours ago"]].map(([name,detail,time]) => <div className="activity-row" key={name}><Avatar name={name}/><div className="activity-text"><b>{name}</b><span>{detail}</span></div><small>{time}</small></div>)}</div>
            </Panel>
          </aside>
        </div>
      </main>
    </div>
  );
}
