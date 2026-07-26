// Toast Notification System with GitHub Version Checking
// This file provides toast notifications and automatic version checking for Knot pages

(function(window){
  'use strict';

  var ToastSystem = {
    // Configuration
    GITHUB_REPO: 'jamestheakston/knot',
    VERSION_CHECK_INTERVAL: 5 * 1000, // Check every 5 seconds
    hasShownUpdateToast: false,
    CURRENT_COMMIT_SHA: null,
    CURRENT_FILE: null,

    // Show a toast notification
    showToast: function(title, message, type, actions, duration){
      var container = document.getElementById('toastContainer');
      if(!container){
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
      }

      var toast = document.createElement('div');
      toast.className = 'toast is-' + (type || 'info');
      
      var actionsHTML = '';
      if(actions && typeof actions === 'object'){
        actionsHTML = '<div class="toast-actions">';
        for(var actionKey in actions){
          if(actions.hasOwnProperty(actionKey)){
            var action = actions[actionKey];
            actionsHTML += '<button class="toast-btn ' + (action.primary ? 'toast-btn-primary' : 'toast-btn-secondary') + '" data-action="' + actionKey + '">' + action.label + '</button>';
          }
        }
        actionsHTML += '</div>';
      }

      toast.innerHTML = `
        <button class="toast-close"><i data-lucide="x"></i></button>
        <div class="toast-header">
          <i data-lucide="info" style="width: 18px; height: 18px; color: var(--blue);"></i>
          <div class="toast-title">${title}</div>
        </div>
        <div class="toast-message">${message}</div>
        ${actionsHTML}
      `;

      container.appendChild(toast);
      
      if(typeof lucide !== 'undefined'){
        lucide.createIcons();
      }

      // Close button handler
      toast.querySelector('.toast-close').onclick = function(){
        toast.style.animation = 'toastSlideOut 0.3s ease forwards';
        setTimeout(function(){
          if(toast.parentElement){
            toast.remove();
          }
        }, 300);
      };

      // Action button handlers
      if(actions && typeof actions === 'object'){
        toast.querySelectorAll('.toast-btn').forEach(function(btn){
          btn.onclick = function(){
            var action = btn.getAttribute('data-action');
            if(actions[action] && actions[action].handler){
              actions[action].handler();
            }
            toast.style.animation = 'toastSlideOut 0.3s ease forwards';
            setTimeout(function(){
              if(toast.parentElement){
                toast.remove();
              }
            }, 300);
          };
        });
      }

      // Optional auto-dismiss (if duration is provided)
      if(duration && duration > 0){
        setTimeout(function(){
          if(toast.parentElement){
            toast.style.animation = 'toastSlideOut 0.3s ease forwards';
            setTimeout(function(){
              if(toast.parentElement){
                toast.remove();
              }
            }, 300);
          }
        }, duration);
      }
    },

    // Fetch current commit on page load
    fetchCurrentCommit: async function(){
      try{
        var response = await fetch('https://api.github.com/repos/' + this.GITHUB_REPO + '/commits/main');
        if(!response.ok) return;
        
        var data = await response.json();
        var currentCommit = data.sha;
        
        // Store in localStorage
        localStorage.setItem('knot_current_commit', currentCommit);
        this.CURRENT_COMMIT_SHA = currentCommit;
      }catch(err){
        console.error('Error fetching current commit:', err);
        // Fallback to stored commit if available
        this.CURRENT_COMMIT_SHA = localStorage.getItem('knot_current_commit');
      }
    },

    // Check for updates
    checkForUpdates: async function(){
      if(!this.CURRENT_COMMIT_SHA){
        await this.fetchCurrentCommit();
        if(!this.CURRENT_COMMIT_SHA) return;
      }
      
      if(!this.CURRENT_FILE){
        console.warn('ToastSystem: CURRENT_FILE not set, skipping version check');
        return;
      }
      
      try{
        var response = await fetch('https://api.github.com/repos/' + this.GITHUB_REPO + '/commits/main');
        if(!response.ok) return;
        
        var data = await response.json();
        var latestCommit = data.sha;
        
        if(latestCommit !== this.CURRENT_COMMIT_SHA && !this.hasShownUpdateToast){
          // Check if this file was modified in the latest commit
          var commitResponse = await fetch('https://api.github.com/repos/' + this.GITHUB_REPO + '/commits/' + latestCommit);
          if(commitResponse.ok){
            var commitData = await commitResponse.json();
            var fileChanged = commitData.files && commitData.files.some(function(file){
              return file.filename === this.CURRENT_FILE;
            }.bind(this));
            
            if(fileChanged){
              this.hasShownUpdateToast = true;
              this.showToast(
                'New Version Available',
                'A new version of this page is available with updates and improvements. <a href="#" onclick="location.reload(); return false;" style="color: var(--blue); text-decoration: underline;">Click here to reload</a>',
                'info',
                {
                  reload: {
                    label: 'Reload',
                    primary: true,
                    handler: function(){
                      location.reload();
                    }
                  },
                  later: {
                    label: 'Later',
                    primary: false,
                    handler: function(){
                      // Reset flag so toast can show again if needed
                      ToastSystem.hasShownUpdateToast = false;
                    }
                  }
                }
              );
            }
          }
        }
      }catch(err){
        console.error('Error checking for updates:', err);
      }
    },

    // Initialize the toast system with version checking
    init: function(currentFile){
      this.CURRENT_FILE = currentFile;
      
      // Fetch current commit on page load
      this.fetchCurrentCommit();
      
      // Start version check after fetching current commit
      setTimeout(this.checkForUpdates.bind(this), 3000); // Check after 3 seconds
      setInterval(this.checkForUpdates.bind(this), this.VERSION_CHECK_INTERVAL); // Check periodically
    },

    // Initialize without version checking (for pages that don't need it)
    initNoVersionCheck: function(){
      // Just initialize, no version checking
    }
  };

  // Expose to global scope
  window.ToastSystem = ToastSystem;
  window.showToast = ToastSystem.showToast.bind(ToastSystem);

})(window);
