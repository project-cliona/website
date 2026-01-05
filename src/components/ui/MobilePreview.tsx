import Image from 'next/image'
import { Icon } from './Icon'

interface MobilePreviewProps {
  selectedAgent: string
  selectedTemplate: string
  agents: Array<{ id: string; name: string; category: string }>
  templates: Array<{ id: string; name: string; type: string; agentId: string }>
}

export function MobilePreview({ selectedAgent, selectedTemplate, agents, templates }: MobilePreviewProps) {
  const agent = agents.find(a => a.id === selectedAgent)
  const template = templates.find(t => t.id === selectedTemplate)

  const mockTemplate = {
    '1': {
      title: 'Holiday Sale Alert!',
      description: 'Get up to 50% OFF on all products. Limited time offer ending soon!',
      image: '/api/placeholder/300/200',
      buttons: [
        { text: 'Shop Now', type: 'URL' },
        { text: 'View Details', type: 'Postback' }
      ]
    },
    '2': {
      title: 'Account Statement Ready',
      description: 'Your monthly account statement for December 2024 is now available.',
      image: '/api/placeholder/300/150',
      buttons: [
        { text: 'View Statement', type: 'URL' },
        { text: 'Download PDF', type: 'URL' }
      ]
    },
    '3': {
      title: 'Login Verification',
      description: 'Your OTP: 123456. This code expires in 5 minutes.',
      image: null,
      buttons: [
        { text: 'Verify Now', type: 'Postback' }
      ]
    }
  }

  const currentMockTemplate = mockTemplate[selectedTemplate as keyof typeof mockTemplate]

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Icon name="phone" className="w-5 h-5 mr-2" />
        Live Preview
      </h2>
      
      {/* Phone Frame */}
      <div className="mx-auto bg-black rounded-[2rem] p-2 w-64">
        <div className="bg-white rounded-[1.5rem] h-96 overflow-hidden">
          {/* Status Bar */}
          <div className="bg-gray-100 px-4 py-2 flex justify-between items-center text-xs">
            <span>9:41</span>
            <div className="flex items-center space-x-1">
              <Icon name="signal" className="w-3 h-3" />
              <Icon name="signal" className="w-3 h-3" />
              <Icon name="battery" className="w-3 h-3" />
            </div>
          </div>
          
          {/* RCS Message */}
          <div className="p-4 h-full overflow-y-auto">
            {selectedAgent && selectedTemplate && currentMockTemplate ? (
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                {/* Agent Info */}
                <div className="flex items-center mb-2">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-2">
                    <span className="text-white text-xs font-bold">
                      {agent?.name.charAt(0)}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-gray-600">
                    {agent?.name}
                  </span>
                </div>
                
                {/* Template Content */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm">{currentMockTemplate.title}</h3>
                  
                  {currentMockTemplate.image && (
                    <Image 
                      src={``}
                      alt="Template preview image"
                      width={240}
                      height={80}
                      className="w-full h-20 rounded object-cover bg-gray-200"
                    />
                  )}
                  
                  <p className="text-xs text-gray-700">{currentMockTemplate.description}</p>
                  
                  {/* Buttons */}
                  <div className="space-y-1 mt-3">
                    {currentMockTemplate.buttons.map((button, index) => (
                      <button 
                        key={index}
                        className="w-full text-xs bg-white border border-blue-300 text-blue-600 py-2 rounded font-medium hover:bg-blue-50"
                      >
                        <span className="flex items-center justify-center">
                          {button.text}
                          <Icon name={button.type === 'URL' ? 'link' : 'chat'} className="w-3 h-3 ml-1" />
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="text-xs text-gray-400 mt-2">
                  Delivered • 10:30 AM
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-center">
                <div className="text-gray-400">
                  <Icon name="phone" className="w-12 h-12 mb-2 text-gray-400" />
                  <p className="text-sm">Select agent and template to preview message</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Preview Info */}
      {selectedAgent && selectedTemplate && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-xs space-y-1">
            <div><strong>Agent:</strong> {agent?.name}</div>
            <div><strong>Template:</strong> {template?.name}</div>
            <div><strong>Type:</strong> {template?.type}</div>
          </div>
        </div>
      )}
    </div>
  )
}