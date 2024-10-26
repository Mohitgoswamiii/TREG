import torch
from torchvision import models, transforms
from PIL import Image, ImageEnhance
import torch.nn.functional as F
from torchvision.models.inception import InceptionOutputs 


model = models.inception_v3(weights=None)
num_ftrs = model.fc.in_features
model.fc = torch.nn.Linear(num_ftrs, 5) 
model.load_state_dict(torch.load('models/inception_v3.pth'))  
model.eval()  

def adjust_sharpness(image, factor=30.5):
    enhancer = ImageEnhance.Sharpness(image)
    return enhancer.enhance(factor)

transform = transforms.Compose([
    transforms.Lambda(lambda img: adjust_sharpness(img)), 
    transforms.Grayscale(num_output_channels=3), 
    transforms.Resize((299, 299)), 
    transforms.ToTensor(),  
    
])


def predict_model(image_path):
    
    image = Image.open(image_path)
    image = transform(image).unsqueeze(0)  
    print(f"Processing image: {image_path}")

    
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    model.to(device)
    image = image.to(device)

  
    with torch.no_grad():
        outputs = model(image)

       
        if isinstance(outputs, InceptionOutputs):
            outputs = outputs.logits 

      
        probabilities = torch.sigmoid(outputs)
        print("Raw logits:", outputs)
        print("Softmax probabilities:", probabilities)

       
        _, predicted = torch.max(outputs, 1)

   
    labels = ['Cybertruck', 'Model 3', 'Model S', 'Model X', 'Model Y']
    predicted_label = labels[predicted.item()]
    print(f"Predicted Tesla model: {predicted_label}")

    return predicted_label


if __name__ == "__main__":
    image_path = 'path_to_your_image.jpg'  
    result = predict_model(image_path)
    print(f"Predicted Tesla model: {result}")
