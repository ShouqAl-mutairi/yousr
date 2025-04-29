// Freelancers Module - Handles freelancer listing and display functionality

import { showNotification } from './ui.js';

// Fetch and display available freelancers
async function fetchAndDisplayFreelancers() {
    if (!window.location.pathname.includes('/freelancers')) {
        return;
    }
    
    try {
        const response = await fetch('/api/freelancers');
        const result = await response.json();
        
        if (result.success && result.freelancers && result.freelancers.length > 0) {
            // Remove static examples if we have real data
            const staticExamples = document.querySelectorAll('.static-example');
            staticExamples.forEach(example => {
                example.style.display = 'none';
            });
            
            const freelancersGrid = document.getElementById('freelancers-grid');
            
            // Display real freelancers from database
            result.freelancers.forEach(freelancer => {
                const card = createFreelancerCard(freelancer);
                freelancersGrid.appendChild(card);
            });
        }
    } catch (error) {
        console.error('Error fetching freelancers:', error);
        // Keep static examples visible in case of error
    }
}

// Create a freelancer card element
function createFreelancerCard(freelancer) {
    // Use a single default image for all freelancers
    const categoryImage = '../assets/images/header/webDev.jpg';
    
    // Display name depending on whether first/last name are available
    const displayName = (freelancer.first_name && freelancer.last_name) 
        ? `${freelancer.first_name} ${freelancer.last_name}` 
        : freelancer.username;
    
    // Use the user's exact specialty input text
    const roleText = freelancer.specialty || 'فريلانسر';
    
    // Format price range
    const priceRange = (freelancer.min_price && freelancer.max_price) 
        ? `${freelancer.min_price} - ${freelancer.max_price}` 
        : '٢٠٠ - ٥٠٠';
    
    // Create card using the service-card style
    const card = document.createElement('div');
    card.className = 'service-card';
    card.dataset.id = freelancer.id;
    
    card.innerHTML = `
        <div class="avatar-container">
            <img src="${freelancer.avatar}" alt="${displayName}" class="avatar">
        </div>
        <img src="${categoryImage}" alt="${roleText}" class="service-image">
        <h3>${displayName}</h3>
        <p class="role"><strong>${roleText}</strong></p>
        <p>${freelancer.profile_bio || 'فريلانسر متاح للعمل على مشاريع جديدة'}</p>
        <p>
            <strong>السعر: ${priceRange}
                <span class="sar-container">
                    <img src="../assets/images/SAR.png" alt="ريال سعودي" class="sar-icon">
                </span>
            </strong>
        </p>
        <div class="actions">
            <button class="primary-btn">
                تواصل <i class="fas fa-comment"></i>
            </button>
            <button class="secondary-btn">
                المزيد <i class="fas fa-arrow-left"></i>
            </button>
        </div>
    `;
    
    // Add event listeners for card buttons
    const contactBtn = card.querySelector('.primary-btn');
    if (contactBtn) {
        contactBtn.addEventListener('click', () => {
            window.location.href = '/contact?freelancer=' + freelancer.id;
        });
    }
    
    const moreBtn = card.querySelector('.secondary-btn');
    if (moreBtn) {
        moreBtn.addEventListener('click', () => {
            // Could redirect to freelancer profile or show more info in a modal
            showFreelancerDetails(freelancer);
        });
    }
    
    return card;
}

// Show freelancer details in a modal
function showFreelancerDetails(freelancer) {
    // Create a modal to display more information about the freelancer
    const modal = document.createElement('div');
    modal.className = 'freelancer-modal';
    
    // Convert specialty code to readable text
    let specialtyText = 'فريلانسر';
    if (freelancer.specialty) {
        const specialtyNames = {
            'web-development': 'مطور ويب',
            'graphic-design': 'مصمم جرافيك',
            'digital-marketing': 'متخصص تسويق رقمي',
            'content-writing': 'كاتب محتوى',
            'other': 'فريلانسر'
        };
        specialtyText = specialtyNames[freelancer.specialty] || 'فريلانسر';
    }
    
    // Format price range
    const priceRange = (freelancer.min_price && freelancer.max_price) 
        ? `${freelancer.min_price} - ${freelancer.max_price}` 
        : '٢٠٠ - ٥٠٠';
        
    // Create display name
    const displayName = (freelancer.first_name && freelancer.last_name) 
        ? `${freelancer.first_name} ${freelancer.last_name}` 
        : freelancer.username;
    
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <div class="freelancer-profile-header">
                <img src="${freelancer.avatar}" alt="${displayName}" class="freelancer-avatar">
                <div class="freelancer-basic-info">
                    <h2>${displayName}</h2>
                    <p class="specialty-badge">${specialtyText}</p>
                    <p class="price-badge">
                        <strong>السعر: ${priceRange}
                            <span class="sar-container">
                                <img src="../assets/images/SAR.png" alt="ريال سعودي" class="sar-icon">
                            </span>
                        </strong>
                    </p>
                </div>
            </div>
            <div class="freelancer-bio">
                <h3>نبذة مهنية</h3>
                <p>${freelancer.profile_bio || 'فريلانسر متاح للعمل على مشاريع جديدة'}</p>
            </div>
            <div class="freelancer-projects">
                <h3>أمثلة من الأعمال</h3>
                <div class="projects-grid" id="freelancer-projects-${freelancer.id}">
                    <p class="loading-projects">جاري تحميل الأعمال...</p>
                </div>
            </div>
            <div class="modal-actions">
                <button class="contact-freelancer-btn primary-btn">
                    تواصل الآن <i class="fas fa-comment"></i>
                </button>
            </div>
        </div>
    `;
    
    // Add modal to the body
    document.body.appendChild(modal);
    
    // Show the modal with animation
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
    
    // Close button functionality
    const closeButton = modal.querySelector('.close-modal');
    closeButton.addEventListener('click', () => {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.remove();
        }, 300);
    });
    
    // Close when clicking outside the modal
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.opacity = '0';
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
    });
    
    // Contact button functionality
    const contactBtn = modal.querySelector('.contact-freelancer-btn');
    contactBtn.addEventListener('click', () => {
        window.location.href = '/contact?freelancer=' + freelancer.id;
    });
    
    // Fetch and display freelancer projects
    fetchFreelancerProjects(freelancer.id, `freelancer-projects-${freelancer.id}`);
}

// Fetch a freelancer's projects
async function fetchFreelancerProjects(freelancerId, containerId) {
    try {
        const response = await fetch(`/api/freelancers/${freelancerId}/projects`);
        const result = await response.json();
        
        const projectsContainer = document.getElementById(containerId);
        
        if (!projectsContainer) return;
        
        // Clear loading message
        projectsContainer.innerHTML = '';
        
        if (result.success && result.projects && result.projects.length > 0) {
            // Display projects
            result.projects.forEach(project => {
                const projectCard = document.createElement('div');
                projectCard.className = 'project-item';
                projectCard.innerHTML = `
                    <h4>${project.title}</h4>
                    <p>${project.description}</p>
                `;
                projectsContainer.appendChild(projectCard);
            });
        } else {
            // No projects found
            projectsContainer.innerHTML = '<p class="no-projects">لا توجد أعمال لعرضها حالياً</p>';
        }
    } catch (error) {
        console.error('Error fetching freelancer projects:', error);
        const projectsContainer = document.getElementById(containerId);
        if (projectsContainer) {
            projectsContainer.innerHTML = '<p class="error-loading">حدث خطأ أثناء تحميل المشاريع</p>';
        }
    }
}

export {
    fetchAndDisplayFreelancers
};