// Toast Notification System with Automatic Version Checking
// This file provides toast notifications for Knot pages
// Types: info, warning, error, newupdate
// - info, warning, error: Simple toasts with title and message
// - newupdate: Automatic version checking with update notifications

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
    // Types: info, warning, error, newupdate
    // For info, warning, error: Provide title and message
    // For newupdate: Automatic version checking (no params needed)
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

      // Choose icon based on type
      var iconName = 'info';
      var iconColor = 'var(--blue)';
      if(type === 'warning'){
        iconName = 'alert-triangle';
        iconColor = '#F59E0B';
      }else if(type === 'error'){
        iconName = 'alert-circle';
        iconColor = '#DC2626';
      }else if(type === 'newupdate'){
        iconName = 'info';
        iconColor = 'var(--blue)';
      }

      toast.innerHTML = `
        <button class="toast-close"><i data-lucide="x"></i></button>
        <div class="toast-header">
          <i data-lucide="${iconName}" style="width: 18px; height: 18px; color: ${iconColor};"></i>
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

    // Show new update toast (automatic version checking)
    showNewUpdateToast: function(){
      this.showToast(
        'New Version Available',
        'A new version of this page is available with updates and improvements. <a href="#" onclick="location.reload(); return false;" style="color: var(--blue); text-decoration: underline;">Click here to reload</a>',
        'newupdate',
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
    },

    // Fetch current commit on page load using UNGH proxy
    fetchCurrentCommit: async function(){
      try{
        // Get repository metadata to find default branch
        var repoRes = await fetch('https://ungh.cc/repos/' + this.GITHUB_REPO);
        var repoData = await repoRes.json();
        
        if(!repoData || !repoData.repo || !repoData.repo.defaultBranch){
          console.error('Error fetching repo data from UNGH');
          this.CURRENT_COMMIT_SHA = localStorage.getItem('knot_current_commit');
          return;
        }
        
        // Get the file tree and root commit SHA for the default branch
        var branchRes = await fetch('https://ungh.cc/repos/' + this.GITHUB_REPO + '/files/' + repoData.repo.defaultBranch);
        var branchData = await branchRes.json();
        
        if(!branchData || !branchData.meta || !branchData.meta.sha){
          console.error('Error fetching branch data from UNGH');
          this.CURRENT_COMMIT_SHA = localStorage.getItem('knot_current_commit');
          return;
        }
        
        var currentCommit = branchData.meta.sha;
        
        // Store in localStorage
        localStorage.setItem('knot_current_commit', currentCommit);
        this.CURRENT_COMMIT_SHA = currentCommit;
      }catch(err){
        console.error('Error fetching current commit:', err);
        // Fallback to stored commit if available
        this.CURRENT_COMMIT_SHA = localStorage.getItem('knot_current_commit');
      }
    },

    // Check for updates using UNGH proxy
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
        // Get repository metadata to find default branch
        var repoRes = await fetch('https://ungh.cc/repos/' + this.GITHUB_REPO);
        var repoData = await repoRes.json();
        
        if(!repoData || !repoData.repo || !repoData.repo.defaultBranch){
          console.error('Error fetching repo data from UNGH');
          return;
        }
        
        // Get the file tree and root commit SHA for the default branch
        var branchRes = await fetch('https://ungh.cc/repos/' + this.GITHUB_REPO + '/files/' + repoData.repo.defaultBranch);
        var branchData = await branchRes.json();
        
        if(!branchData || !branchData.meta || !branchData.meta.sha){
          console.error('Error fetching branch data from UNGH');
          return;
        }
        
        var latestCommit = branchData.meta.sha;
        
        if(latestCommit !== this.CURRENT_COMMIT_SHA && !this.hasShownUpdateToast){
          // Check if this file was modified in the latest commit using GitHub API
          var commitRes = await fetch('https://api.github.com/repos/' + this.GITHUB_REPO + '/commits/' + latestCommit);
          var commitData = await commitRes.json();
          
          if(commitData && commitData.files){
            var fileChanged = commitData.files.some(function(file){
              return file.filename === this.CURRENT_FILE;
            }.bind(this));
            
            if(fileChanged){
              this.hasShownUpdateToast = true;
              this.showNewUpdateToast();
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
  window.showNewUpdateToast = ToastSystem.showNewUpdateToast.bind(ToastSystem);

})(window);
