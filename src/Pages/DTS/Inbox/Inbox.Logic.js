export function Tasks(tasks) {
  this.getTasksArray = tasks;
  this.getTasks = () => {
    return (
      <ul>
        {this.getTasksArray.map((task, index) => {
          switch (task) {
            case "addInitialRouting":
              return <li key={index}>Add Initial Routing</li>;
            case "addRoutingNote":
              return <li key={index}>Add Routing Note</li>;
            case "routeCommunication":
              return <li key={index}>Route Communication</li>;
            case "viewRouting":
              return <li key={index}>View Routing</li>;
            case "addAction":
              return <li key={index}>Add Action</li>;
            case "forRouting":
              return <li key={index}>For Routing</li>;
            case "reviewAction":
              return <li key={index}>Review Action Taken</li>;
            case "viewActionStatus":
              return <li key={index}>View action for revision</li>;
            case "reforwardForAction":
              return <li key={index}>Refoward communication</li>;
            default:
              return <li key={index}>View Communication</li>;
          }
        })}
      </ul>
    );
  };
}
