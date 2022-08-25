import styled from '@emotion/native';

export const Container = styled.View`
  margin-top: 10px;
  flex-direction: row;
  align-items: center;

  border: 0.3px solid black ;
  margin : 10px;

  border-radius: 3px;
  
  

  padding: 6px;
`;


export const ContainerC = styled.View`
  margin-top: 10px;
  flex-direction: row;
  align-items: center;
  

  border: 0.3px solid #1f65ff ;
  border-radius : 25px;
  margin : 10px;

  

  padding: 6px;
`;

export const ImageContainer = styled.Image`
  height: 60px;
  width: 60px;
  background-color: #eee;
  border-radius: 50px;
`;


export const ImageContainerC = styled.Image`
  height: 60px;
  width: 60px;
  background-color: #eee;
  border-radius: 50px;
`;

export const Content = styled.View`
  margin-left: 20px;
  flex: 1;
`;

export const Name = styled.Text`
  font-size: 18px;
  font-weight: bold;
`;

export const Email = styled.Text`
  font-size: 14px;
`;
export const FooterContent = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 10px;
`;
export const FooterText = styled.Text`
  font-weight: bold;
`;